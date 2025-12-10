<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateNutritionLogRequest;
use App\Http\Resources\Api\V1\NutritionLogResource;
use App\Models\NutritionLog;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NutritionLogController extends Controller
{
    /**
     * List user's nutrition logs with filters.
     */
    public function index(Request $request)
    {
        try {
            $query = NutritionLog::where('user_id', auth()->id())
                ->orderBy('logged_at', 'desc');

            // Filter by date range
            if ($request->has('from')) {
                $query->where('logged_at', '>=', $request->from);
            }

            if ($request->has('to')) {
                $query->where('logged_at', '<=', $request->to);
            }

            $logs = $query->paginate($request->get('per_page', 15));

            // Calculate daily totals summary
            if ($request->has('include_totals') && $request->boolean('include_totals')) {
                $totals = NutritionLog::where('user_id', auth()->id())
                    ->selectRaw('
                        SUM(kcal) as total_kcal,
                        SUM(protein_g) as total_protein_g,
                        SUM(carbs_g) as total_carbs_g,
                        SUM(fats_g) as total_fats_g,
                        AVG(water_ml) as avg_water_ml
                    ')
                    ->when($request->has('from'), function ($q) use ($request) {
                        $q->where('logged_at', '>=', $request->from);
                    })
                    ->when($request->has('to'), function ($q) use ($request) {
                        $q->where('logged_at', '<=', $request->to);
                    })
                    ->first();

                return response()->json([
                    'data' => NutritionLogResource::collection($logs),
                    'totals' => [
                        'total_kcal' => (int) ($totals->total_kcal ?? 0),
                        'total_protein_g' => round($totals->total_protein_g ?? 0, 2),
                        'total_carbs_g' => round($totals->total_carbs_g ?? 0, 2),
                        'total_fats_g' => round($totals->total_fats_g ?? 0, 2),
                        'avg_water_ml' => round($totals->avg_water_ml ?? 0, 0),
                    ],
                ]);
            }

            return NutritionLogResource::collection($logs);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve nutrition logs', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving nutrition logs.',
            ], 500);
        }
    }

    /**
     * Create a new nutrition log.
     */
    public function store(CreateNutritionLogRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Check for duplicate log on same date
            $existingLog = NutritionLog::where('user_id', auth()->id())
                ->where('logged_at', $validated['logged_at'])
                ->first();

            if ($existingLog) {
                return response()->json([
                    'error' => 'duplicate_entry',
                    'message' => 'A nutrition log already exists for this date.',
                ], 409);
            }

            // Validate macro totals are reasonable
            $totalCalories = ($validated['protein_g'] * 4) + 
                           ($validated['carbs_g'] * 4) + 
                           ($validated['fats_g'] * 9);
            
            $calorieDifference = abs($totalCalories - $validated['kcal']);
            
            // Allow 10% difference for rounding
            if ($calorieDifference > ($validated['kcal'] * 0.1)) {
                return response()->json([
                    'error' => 'invalid_macros',
                    'message' => 'The total calories from macros do not match the provided calorie value.',
                ], 422);
            }

            $log = NutritionLog::create([
                ...$validated,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'data' => new NutritionLogResource($log),
                'message' => 'Nutrition log created successfully.',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create nutrition log', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while creating the nutrition log.',
            ], 500);
        }
    }
}
