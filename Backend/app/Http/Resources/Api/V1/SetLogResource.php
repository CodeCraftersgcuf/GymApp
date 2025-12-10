<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SetLogResource extends JsonResource
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
            'set_number' => $this->set_number,
            'weight_kg' => $this->weight_kg,
            'reps' => $this->reps,
            'rpe' => $this->rpe,
            'notes' => $this->notes,
            'exercise' => $this->whenLoaded('exercise', fn() => [
                'id' => $this->exercise->id,
                'title' => $this->exercise->title,
                'primary_muscle' => $this->exercise->primary_muscle,
            ]),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}

