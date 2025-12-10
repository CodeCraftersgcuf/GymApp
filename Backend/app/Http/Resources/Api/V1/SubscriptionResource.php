<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
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
            'status' => $this->status,
            'started_at' => $this->started_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
            'provider' => $this->provider,
            'provider_ref' => $this->provider_ref,
            'product' => $this->whenLoaded('product', fn() => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'slug' => $this->product->slug,
                'interval' => $this->product->interval,
            ]),
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'is_active' => $this->status === 'active' && 
                          $this->ends_at && 
                          $this->ends_at->isFuture(),
            'days_remaining' => $this->when(
                $this->ends_at && $this->ends_at->isFuture(),
                fn() => now()->diffInDays($this->ends_at)
            ),
            'meta' => $this->meta,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}

