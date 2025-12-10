<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MealPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'kcal_target' => $this->kcal_target,
            'protein_target_g' => $this->protein_target_g,
            'carbs_target_g' => $this->carbs_target_g,
            'fats_target_g' => $this->fats_target_g,
            'is_public' => $this->is_public,
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'coach' => $this->whenLoaded('coach', fn() => [
                'id' => $this->coach->id,
                'name' => $this->coach->name,
            ]),
            'meals' => MealResource::collection($this->whenLoaded('meals')),
            'total_macros' => $this->whenLoaded('meals', function () {
                $meals = $this->meals;
                $total = ['kcal' => 0, 'protein_g' => 0, 'carbs_g' => 0, 'fats_g' => 0];
                
                foreach ($meals as $meal) {
                    if ($meal->relationLoaded('mealItems')) {
                        foreach ($meal->mealItems as $item) {
                            if ($item->relationLoaded('food')) {
                                $total['kcal'] += ($item->food->kcal ?? 0) * $item->servings;
                                $total['protein_g'] += ($item->food->protein_g ?? 0) * $item->servings;
                                $total['carbs_g'] += ($item->food->carbs_g ?? 0) * $item->servings;
                                $total['fats_g'] += ($item->food->fats_g ?? 0) * $item->servings;
                            }
                        }
                    }
                }
                
                return [
                    'kcal' => round($total['kcal'], 0),
                    'protein_g' => round($total['protein_g'], 2),
                    'carbs_g' => round($total['carbs_g'], 2),
                    'fats_g' => round($total['fats_g'], 2),
                ];
            }),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}

