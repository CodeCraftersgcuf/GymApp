<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientOverviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $thirtyDaysAgo = now()->subDays(30);

        return [
            'user' => [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'phone' => $this->phone,
                'gender' => $this->gender,
                'dob' => $this->dob?->format('Y-m-d'),
                'weight_kg' => $this->weight_kg,
                'height_cm' => $this->height_cm,
                'goal' => $this->goal,
                'profile_picture' => $this->getFirstMediaUrl('profile_pictures'),
            ],
            'active_programs' => UserProgramResource::collection(
                $this->whenLoaded('userPrograms', function () {
                    return $this->userPrograms->where('status', 'active')->load('program');
                })
            ),
            'recent_workouts' => WorkoutLogResource::collection(
                $this->whenLoaded('workoutLogs', function () use ($thirtyDaysAgo) {
                    return $this->workoutLogs()
                        ->where('performed_at', '>=', $thirtyDaysAgo)
                        ->with(['workout', 'setLogs.exercise'])
                        ->orderBy('performed_at', 'desc')
                        ->limit(10)
                        ->get();
                })
            ),
            'recent_nutrition' => NutritionLogResource::collection(
                $this->whenLoaded('nutritionLogs', function () use ($thirtyDaysAgo) {
                    return $this->nutritionLogs()
                        ->where('logged_at', '>=', $thirtyDaysAgo)
                        ->orderBy('logged_at', 'desc')
                        ->limit(10)
                        ->get();
                })
            ),
            'recent_progress' => ProgressLogResource::collection(
                $this->whenLoaded('progressLogs', function () use ($thirtyDaysAgo) {
                    return $this->progressLogs()
                        ->where('logged_at', '>=', $thirtyDaysAgo)
                        ->orderBy('logged_at', 'desc')
                        ->limit(10)
                        ->get();
                })
            ),
            'statistics' => [
                'total_workouts' => $this->when(
                    $this->relationLoaded('workoutLogs'),
                    fn() => $this->workoutLogs->count()
                ),
                'workouts_last_30_days' => $this->when(
                    $this->relationLoaded('workoutLogs'),
                    fn() => $this->workoutLogs->where('performed_at', '>=', $thirtyDaysAgo)->count()
                ),
                'avg_calories_last_30_days' => $this->when(
                    $this->relationLoaded('nutritionLogs'),
                    function () use ($thirtyDaysAgo) {
                        $logs = $this->nutritionLogs->where('logged_at', '>=', $thirtyDaysAgo);
                        return $logs->count() > 0 
                            ? round($logs->avg('kcal'), 0) 
                            : null;
                    }
                ),
                'total_progress_logs' => $this->when(
                    $this->relationLoaded('progressLogs'),
                    fn() => $this->progressLogs->count()
                ),
                'latest_weight' => $this->when(
                    $this->relationLoaded('progressLogs'),
                    fn() => $this->progressLogs->sortByDesc('logged_at')->first()?->weight_kg
                ),
            ],
        ];
    }
}

