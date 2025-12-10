<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateWorkoutLogRequest;
use App\Http\Resources\Api\V1\WorkoutLogResource;
use App\Models\SetLog;
use App\Models\Workout;
use App\Models\WorkoutLog;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WorkoutLogController extends Controller
{
    /**
     * List user's workout logs with filters.
     */
    public function index(Request $request)
    {
        try {
            $query = WorkoutLog::where('user_id', auth()->id())
                ->with(['workout:id,title,day_of_week', 'setLogs.exercise:id,title,primary_muscle'])
                ->orderBy('performed_at', 'desc');

            // Filter by date range
            if ($request->has('from')) {
                $query->where('performed_at', '>=', $request->from);
            }

            if ($request->has('to')) {
                $query->where('performed_at', '<=', $request->to);
            }

            // Filter by workout_id
            if ($request->has('workout_id')) {
                $query->where('workout_id', $request->workout_id);
            }

            $logs = $query->paginate($request->get('per_page', 15));

            return WorkoutLogResource::collection($logs);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve workout logs', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving workout logs.',
            ], 500);
        }
    }

    /**
     * Create a new workout log with sets.
     */
    public function store(CreateWorkoutLogRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Verify workout exists
            $workout = Workout::findOrFail($validated['workout_id']);

            $workoutLog = DB::transaction(function () use ($validated) {
                // Create workout log
                $log = WorkoutLog::create([
                    'user_id' => auth()->id(),
                    'workout_id' => $validated['workout_id'],
                    'performed_at' => $validated['performed_at'],
                    'duration_minutes' => $validated['duration_minutes'] ?? null,
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Create set logs
                foreach ($validated['sets'] as $setData) {
                    SetLog::create([
                        'workout_log_id' => $log->id,
                        'exercise_id' => $setData['exercise_id'],
                        'set_number' => $setData['set_number'],
                        'weight_kg' => $setData['weight_kg'] ?? null,
                        'reps' => $setData['reps'],
                        'rpe' => $setData['rpe'] ?? null,
                        'notes' => $setData['notes'] ?? null,
                    ]);
                }

                return $log;
            });

            return response()->json([
                'data' => new WorkoutLogResource($workoutLog->load(['workout', 'setLogs.exercise'])),
                'message' => 'Workout log created successfully.',
            ], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'Workout not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to create workout log', [
                'user_id' => auth()->id(),
                'workout_id' => $request->workout_id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while creating the workout log.',
            ], 500);
        }
    }

    /**
     * Get workout log details with all sets.
     */
    public function show($id)
    {
        try {
            $log = WorkoutLog::with(['workout', 'setLogs.exercise'])
                ->where('user_id', auth()->id())
                ->findOrFail($id);

            return new WorkoutLogResource($log);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'Workout log not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve workout log', [
                'workout_log_id' => $id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving the workout log.',
            ], 500);
        }
    }
}
