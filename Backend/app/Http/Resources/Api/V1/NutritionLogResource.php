<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NutritionLogResource extends JsonResource
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
            'logged_at' => $this->logged_at->format('Y-m-d'),
            'kcal' => $this->kcal,
            'protein_g' => $this->protein_g,
            'carbs_g' => $this->carbs_g,
            'fats_g' => $this->fats_g,
            'water_ml' => $this->water_ml,
            'notes' => $this->notes,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}

