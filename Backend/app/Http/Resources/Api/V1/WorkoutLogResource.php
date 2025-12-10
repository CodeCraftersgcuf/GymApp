<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkoutLogResource extends JsonResource
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
            'performed_at' => $this->performed_at->toIso8601String(),
            'duration_minutes' => $this->duration_minutes,
            'notes' => $this->notes,
            'workout' => $this->whenLoaded('workout', fn() => [
                'id' => $this->workout->id,
                'title' => $this->workout->title,
                'day_of_week' => $this->workout->day_of_week,
            ]),
            'sets' => SetLogResource::collection($this->whenLoaded('setLogs')),
            'sets_count' => $this->when(isset($this->setLogs), fn() => $this->setLogs->count()),
            'total_volume' => $this->when(isset($this->setLogs), function () {
                return $this->setLogs->sum(function ($set) {
                    return ($set->weight_kg ?? 0) * $set->reps;
                });
            }),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
