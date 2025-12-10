<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SubscribeProgramRequest;
use App\Http\Resources\Api\V1\UserProgramResource;
use App\Models\Program;
use App\Models\UserProgram;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserProgramController extends Controller
{
    /**
     * List user's subscribed programs.
     */
    public function index(Request $request)
    {
        try {
            $query = UserProgram::where('user_id', auth()->id())
                ->with(['program.coach:id,name', 'coach:id,name']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $programs = $query->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return UserProgramResource::collection($programs);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve user programs', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving your programs.',
            ], 500);
        }
    }

    /**
     * Subscribe to a program.
     */
    public function store(SubscribeProgramRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Verify program exists
            $program = Program::findOrFail($validated['program_id']);

            // Check if program is available
            if (!$program->is_public && $program->coach_id !== auth()->id() && !auth()->user()->hasRole('Admin')) {
                return response()->json([
                    'error' => 'program_unavailable',
                    'message' => 'This program is not available for subscription.',
                ], 403);
            }

            // Check if user is already subscribed
            $existingSubscription = UserProgram::where('user_id', auth()->id())
                ->where('program_id', $validated['program_id'])
                ->where('status', 'active')
                ->first();

            if ($existingSubscription) {
                return response()->json([
                    'error' => 'already_subscribed',
                    'message' => 'You are already subscribed to this program.',
                ], 409);
            }

            // Validate coach if provided
            if (isset($validated['coach_id'])) {
                $coach = \App\Models\User::findOrFail($validated['coach_id']);
                
                if (!$coach->hasRole('Coach') && !$coach->hasRole('Admin')) {
                    return response()->json([
                        'error' => 'invalid_coach',
                        'message' => 'The selected user is not a coach.',
                    ], 422);
                }

                // Verify coach created this program or is assigned
                if ($program->coach_id !== $validated['coach_id'] && !auth()->user()->hasRole('Admin')) {
                    return response()->json([
                        'error' => 'coach_mismatch',
                        'message' => 'The selected coach is not associated with this program.',
                    ], 422);
                }
            } else {
                // Use program's coach if no coach specified
                $validated['coach_id'] = $program->coach_id;
            }

            // Calculate start and end dates
            $startDate = now();
            $endDate = $startDate->copy()->addWeeks($program->duration_weeks);

            $userProgram = UserProgram::create([
                'user_id' => auth()->id(),
                'program_id' => $validated['program_id'],
                'coach_id' => $validated['coach_id'],
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'active',
            ]);

            return response()->json([
                'data' => new UserProgramResource($userProgram->load(['program', 'coach'])),
                'message' => 'Successfully subscribed to program.',
            ], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'Program not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to subscribe to program', [
                'user_id' => auth()->id(),
                'program_id' => $request->program_id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while subscribing to the program.',
            ], 500);
        }
    }

    /**
     * Get program details with progress.
     */
    public function show($id)
    {
        try {
            $userProgram = UserProgram::with([
                'program.phases.workouts.exercises',
                'program.coach:id,name',
                'coach:id,name',
            ])
                ->where('user_id', auth()->id())
                ->findOrFail($id);

            return new UserProgramResource($userProgram);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'Program subscription not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve user program', [
                'user_program_id' => $id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving the program.',
            ], 500);
        }
    }
}
