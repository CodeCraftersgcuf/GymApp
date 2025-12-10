<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserProgramResource extends JsonResource
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
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'status' => $this->status,
            'program' => $this->whenLoaded('program', fn() => new ProgramResource($this->program)),
            'coach' => $this->whenLoaded('coach', fn() => [
                'id' => $this->coach->id,
                'name' => $this->coach->name,
                'email' => $this->coach->email,
            ]),
            'progress' => $this->when($request->has('include_progress') && $this->relationLoaded('program'), function () {
                // Calculate progress statistics
                if (!$this->program || !$this->program->relationLoaded('phases')) {
                    return null;
                }

                $userId = $this->user_id;
                $programId = $this->program_id;

                $workoutLogsCount = \App\Models\WorkoutLog::where('user_id', $userId)
                    ->whereHas('workout', function ($query) use ($programId) {
                        $query->whereHas('phase', function ($q) use ($programId) {
                            $q->where('program_id', $programId);
                        });
                    })
                    ->count();

                $totalWorkouts = $this->program->phases->sum(function ($phase) {
                    return $phase->workouts->count();
                });

                return [
                    'workouts_completed' => $workoutLogsCount,
                    'total_workouts' => $totalWorkouts,
                    'completion_percentage' => $totalWorkouts > 0 
                        ? round(($workoutLogsCount / $totalWorkouts) * 100, 2) 
                        : 0,
                ];
            }),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}

