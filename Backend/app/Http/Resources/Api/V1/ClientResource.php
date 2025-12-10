<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'gender' => $this->gender,
            'weight_kg' => $this->weight_kg,
            'height_cm' => $this->height_cm,
            'goal' => $this->goal,
            'profile_picture' => $this->getFirstMediaUrl('profile_pictures'),
            'active_programs_count' => $this->when(
                $this->relationLoaded('userPrograms'),
                fn() => $this->userPrograms->where('status', 'active')->count()
            ),
            'total_workouts' => $this->when(
                $this->relationLoaded('workoutLogs'),
                fn() => $this->workoutLogs->count()
            ),
            'last_workout' => $this->when(
                $this->relationLoaded('workoutLogs'),
                fn() => $this->workoutLogs->max('performed_at')?->toIso8601String()
            ),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}

