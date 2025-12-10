<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateProgressLogRequest;
use App\Http\Resources\Api\V1\ProgressLogResource;
use App\Models\ProgressLog;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProgressLogController extends Controller
{
    /**
     * List user's progress logs with filters.
     */
    public function index(Request $request)
    {
        try {
            $query = ProgressLog::where('user_id', auth()->id())
                ->orderBy('logged_at', 'desc');

            // Filter by date range
            if ($request->has('from')) {
                $query->where('logged_at', '>=', $request->from);
            }

            if ($request->has('to')) {
                $query->where('logged_at', '<=', $request->to);
            }

            $logs = $query->paginate($request->get('per_page', 15));

            // Calculate changes from previous log for each entry
            $logs->getCollection()->transform(function ($log) {
                $previousLog = ProgressLog::where('user_id', $log->user_id)
                    ->where('logged_at', '<', $log->logged_at)
                    ->orderBy('logged_at', 'desc')
                    ->first();

                if ($previousLog) {
                    $log->changes = [
                        'weight_kg' => $log->weight_kg && $previousLog->weight_kg
                            ? round($log->weight_kg - $previousLog->weight_kg, 2)
                            : null,
                        'body_fat_percent' => $log->body_fat_percent && $previousLog->body_fat_percent
                            ? round($log->body_fat_percent - $previousLog->body_fat_percent, 2)
                            : null,
                        'chest_cm' => $log->chest_cm && $previousLog->chest_cm
                            ? round($log->chest_cm - $previousLog->chest_cm, 2)
                            : null,
                        'waist_cm' => $log->waist_cm && $previousLog->waist_cm
                            ? round($log->waist_cm - $previousLog->waist_cm, 2)
                            : null,
                        'hips_cm' => $log->hips_cm && $previousLog->hips_cm
                            ? round($log->hips_cm - $previousLog->hips_cm, 2)
                            : null,
                    ];
                } else {
                    $log->changes = null;
                }

                return $log;
            });

            return ProgressLogResource::collection($logs);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve progress logs', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving progress logs.',
            ], 500);
        }
    }

    /**
     * Create a new progress log.
     */
    public function store(CreateProgressLogRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Check for duplicate log on same date
            $existingLog = ProgressLog::where('user_id', auth()->id())
                ->where('logged_at', $validated['logged_at'])
                ->first();

            if ($existingLog) {
                return response()->json([
                    'error' => 'duplicate_entry',
                    'message' => 'A progress log already exists for this date.',
                ], 409);
            }

            $log = ProgressLog::create([
                ...$validated,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'data' => new ProgressLogResource($log),
                'message' => 'Progress log created successfully.',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create progress log', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while creating the progress log.',
            ], 500);
        }
    }
}
