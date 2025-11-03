<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'equipment' => $this->equipment,
            'primary_muscle' => $this->primary_muscle,
            'difficulty' => $this->difficulty,
            'video_url' => $this->video_url,
            'instructions' => $this->instructions,
            'pivot' => $this->whenPivotLoaded('exercise_workout', fn() => [
                'sets' => $this->pivot->sets,
                'reps_min' => $this->pivot->reps_min,
                'reps_max' => $this->pivot->reps_max,
                'rest_seconds' => $this->pivot->rest_seconds,
                'tempo' => $this->pivot->tempo,
            ]),
        ];
    }
}

