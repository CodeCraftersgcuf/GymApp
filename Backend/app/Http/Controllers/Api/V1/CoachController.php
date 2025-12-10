<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateMealPlanRequest;
use App\Http\Resources\Api\V1\ClientOverviewResource;
use App\Http\Resources\Api\V1\ClientResource;
use App\Http\Resources\Api\V1\MealPlanResource;
use App\Models\Meal;
use App\Models\MealItem;
use App\Models\MealPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CoachController extends Controller
{
    /**
     * List coach's clients.
     */
    public function clients(Request $request)
    {
        try {
            $coachId = auth()->id();

            // Get all users who have active programs with this coach
            $query = User::whereHas('userPrograms', function ($q) use ($coachId) {
                $q->where('coach_id', $coachId);
                
                // Filter by active/inactive programs
                if ($request->has('status')) {
                    $q->where('status', $request->status);
                } else {
                    $q->where('status', 'active');
                }
            })
                ->with([
                    'userPrograms' => function ($q) use ($coachId) {
                        $q->where('coach_id', $coachId)->where('status', 'active');
                    },
                    'workoutLogs' => function ($q) {
                        $q->orderBy('performed_at', 'desc')->limit(5);
                    },
                ])
                ->distinct();

            $clients = $query->paginate($request->get('per_page', 15));

            return ClientResource::collection($clients);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve clients', [
                'coach_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving clients.',
            ], 500);
        }
    }

    /**
     * Get client's comprehensive overview.
     */
    public function clientOverview($userId)
    {
        try {
            $coachId = auth()->id();

            // Verify coach-client relationship
            $hasRelationship = UserProgram::where('user_id', $userId)
                ->where('coach_id', $coachId)
                ->exists();

            if (!$hasRelationship && !auth()->user()->hasRole('Admin')) {
                return response()->json([
                    'error' => 'forbidden',
                    'message' => 'You do not have permission to view this client.',
                ], 403);
            }

            $client = User::with([
                'userPrograms' => function ($q) use ($coachId) {
                    $q->where('coach_id', $coachId)->where('status', 'active')->with('program');
                },
                'workoutLogs' => function ($q) {
                    $q->with(['workout', 'setLogs.exercise'])
                        ->orderBy('performed_at', 'desc');
                },
                'nutritionLogs' => function ($q) {
                    $q->orderBy('logged_at', 'desc');
                },
                'progressLogs' => function ($q) {
                    $q->orderBy('logged_at', 'desc');
                },
            ])->findOrFail($userId);

            return new ClientOverviewResource($client);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'Client not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve client overview', [
                'coach_id' => auth()->id(),
                'client_id' => $userId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving client overview.',
            ], 500);
        }
    }

    /**
     * Create a meal plan for a client.
     */
    public function createMealPlan(CreateMealPlanRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $coachId = auth()->id();

            // Verify coach-client relationship
            $hasRelationship = UserProgram::where('user_id', $validated['user_id'])
                ->where('coach_id', $coachId)
                ->where('status', 'active')
                ->exists();

            if (!$hasRelationship && !auth()->user()->hasRole('Admin')) {
                return response()->json([
                    'error' => 'forbidden',
                    'message' => 'You do not have permission to create a meal plan for this client.',
                ], 403);
            }

            $mealPlan = DB::transaction(function () use ($validated, $coachId) {
                // Create meal plan
                $plan = MealPlan::create([
                    'user_id' => $validated['user_id'],
                    'coach_id' => $coachId,
                    'title' => $validated['title'],
                    'kcal_target' => $validated['kcal_target'],
                    'protein_target_g' => $validated['protein_target_g'],
                    'carbs_target_g' => $validated['carbs_target_g'],
                    'fats_target_g' => $validated['fats_target_g'],
                    'description' => $validated['description'] ?? null,
                    'is_public' => false,
                ]);

                // Create meals and meal items
                foreach ($validated['meals'] as $mealData) {
                    $meal = Meal::create([
                        'meal_plan_id' => $plan->id,
                        'title' => $mealData['title'],
                        'meal_type' => $mealData['meal_type'],
                        'order' => $mealData['order'],
                    ]);

                    foreach ($mealData['items'] as $itemData) {
                        MealItem::create([
                            'meal_id' => $meal->id,
                            'food_id' => $itemData['food_id'],
                            'servings' => $itemData['servings'],
                            'order' => $itemData['order'],
                        ]);
                    }
                }

                return $plan;
            });

            return response()->json([
                'data' => new MealPlanResource($mealPlan->load(['meals.mealItems.food', 'user', 'coach'])),
                'message' => 'Meal plan created successfully.',
            ], 201);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'User or food not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to create meal plan', [
                'coach_id' => auth()->id(),
                'user_id' => $request->user_id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while creating the meal plan.',
            ], 500);
        }
    }
}
