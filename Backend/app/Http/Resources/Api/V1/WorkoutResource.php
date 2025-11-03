<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'day_of_week' => $this->day_of_week,
            'notes' => $this->notes,
            'order' => $this->order,
            'exercises' => ExerciseResource::collection($this->whenLoaded('exercises')),
        ];
    }
}

