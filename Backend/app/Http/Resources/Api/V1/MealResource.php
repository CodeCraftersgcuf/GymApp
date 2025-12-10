<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MealResource extends JsonResource
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
            'meal_type' => $this->meal_type,
            'order' => $this->order,
            'items' => MealItemResource::collection($this->whenLoaded('mealItems')),
            'total_macros' => $this->whenLoaded('mealItems', function () {
                $items = $this->mealItems;
                return [
                    'kcal' => round($items->sum(function ($item) {
                        return ($item->food->kcal ?? 0) * $item->servings;
                    }), 0),
                    'protein_g' => round($items->sum(function ($item) {
                        return ($item->food->protein_g ?? 0) * $item->servings;
                    }), 2),
                    'carbs_g' => round($items->sum(function ($item) {
                        return ($item->food->carbs_g ?? 0) * $item->servings;
                    }), 2),
                    'fats_g' => round($items->sum(function ($item) {
                        return ($item->food->fats_g ?? 0) * $item->servings;
                    }), 2),
                ];
            }),
        ];
    }
}

