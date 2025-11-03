<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgramResource extends JsonResource
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
            'goal' => $this->goal,
            'level' => $this->level,
            'duration_weeks' => $this->duration_weeks,
            'is_public' => $this->is_public,
            'price_cents' => $this->price_cents,
            'coach' => $this->whenLoaded('coach', fn() => [
                'id' => $this->coach->id,
                'name' => $this->coach->name,
            ]),
            'phases' => PhaseResource::collection($this->whenLoaded('phases')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
