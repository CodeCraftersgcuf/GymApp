<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MealItemResource extends JsonResource
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
            'servings' => $this->servings,
            'order' => $this->order,
            'food' => $this->whenLoaded('food', fn() => [
                'id' => $this->food->id,
                'name' => $this->food->name,
                'serving_unit' => $this->food->serving_unit,
                'serving_size' => $this->food->serving_size,
                'kcal' => $this->food->kcal,
                'protein_g' => $this->food->protein_g,
                'carbs_g' => $this->food->carbs_g,
                'fats_g' => $this->food->fats_g,
            ]),
            'calculated_macros' => $this->whenLoaded('food', function () {
                return [
                    'kcal' => round($this->food->kcal * $this->servings, 0),
                    'protein_g' => round($this->food->protein_g * $this->servings, 2),
                    'carbs_g' => round($this->food->carbs_g * $this->servings, 2),
                    'fats_g' => round($this->food->fats_g * $this->servings, 2),
                ];
            }),
        ];
    }
}

