<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateCheckInRequest;
use App\Http\Requests\Api\V1\CompleteCheckInRequest;
use App\Http\Resources\Api\V1\CheckInResource;
use App\Models\CheckIn;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckInController extends Controller
{
    /**
     * List user's check-ins with coach information.
     */
    public function index(Request $request)
    {
        try {
            $query = CheckIn::where('user_id', auth()->id())
                ->with(['coach:id,name,email'])
                ->orderBy('scheduled_at', 'desc');

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by date range
            if ($request->has('from')) {
                $query->where('scheduled_at', '>=', $request->from);
            }

            if ($request->has('to')) {
                $query->where('scheduled_at', '<=', $request->to);
            }

            $checkIns = $query->paginate($request->get('per_page', 15));

            return CheckInResource::collection($checkIns);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve check-ins', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving check-ins.',
            ], 500);
        }
    }

    /**
     * Request a new check-in with coach.
     */
    public function store(CreateCheckInRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Verify coach exists and has Coach role
            $coach = User::findOrFail($validated['coach_id']);
            
            if (!$coach->hasRole('Coach') && !$coach->hasRole('Admin')) {
                return response()->json([
                    'error' => 'invalid_coach',
                    'message' => 'The selected user is not a coach.',
                ], 422);
            }

            // Check if user has an active program with this coach
            $hasActiveProgram = auth()->user()->userPrograms()
                ->where('coach_id', $validated['coach_id'])
                ->where('status', 'active')
                ->exists();

            if (!$hasActiveProgram) {
                return response()->json([
                    'error' => 'no_active_program',
                    'message' => 'You must have an active program with this coach to request a check-in.',
                ], 422);
            }

            // Prevent duplicate check-ins on same date
            $existingCheckIn = CheckIn::where('user_id', auth()->id())
                ->where('coach_id', $validated['coach_id'])
                ->whereDate('scheduled_at', $validated['scheduled_at'])
                ->where('status', 'pending')
                ->first();

            if ($existingCheckIn) {
                return response()->json([
                    'error' => 'duplicate_checkin',
                    'message' => 'You already have a pending check-in scheduled with this coach on this date.',
                ], 409);
            }

            $checkIn = CheckIn::create([
                ...$validated,
                'user_id' => auth()->id(),
                'status' => 'pending',
            ]);

            return response()->json([
                'data' => new CheckInResource($checkIn->load('coach')),
                'message' => 'Check-in requested successfully.',
            ], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'Coach not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to create check-in', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while creating the check-in.',
            ], 500);
        }
    }

    /**
     * Coach completes a check-in.
     */
    public function complete(CompleteCheckInRequest $request, $id): JsonResponse
    {
        try {
            $checkIn = CheckIn::findOrFail($id);

            // Verify coach owns this check-in
            if ($checkIn->coach_id !== auth()->id() && !auth()->user()->hasRole('Admin')) {
                return response()->json([
                    'error' => 'forbidden',
                    'message' => 'You do not have permission to complete this check-in.',
                ], 403);
            }

            // Verify check-in is pending
            if ($checkIn->status !== 'pending') {
                return response()->json([
                    'error' => 'invalid_status',
                    'message' => 'Only pending check-ins can be completed.',
                ], 422);
            }

            $validated = $request->validated();

            $checkIn->update([
                'status' => 'completed',
                'completed_at' => now(),
                'notes' => $validated['notes'] ?? $checkIn->notes,
            ]);

            return response()->json([
                'data' => new CheckInResource($checkIn->load(['user', 'coach'])),
                'message' => 'Check-in completed successfully.',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'Check-in not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to complete check-in', [
                'check_in_id' => $id,
                'coach_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while completing the check-in.',
            ], 500);
        }
    }
}
