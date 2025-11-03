<?php

namespace Database\Factories;

use App\Models\Plan;
use App\Models\PlanVideo;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanVideoFactory extends Factory
{
    protected $model = PlanVideo::class;

    public function definition(): array
    {
        return [
            'plan_id' => Plan::factory(),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'youtube_url' => 'https://www.youtube.com/watch?v=' . $this->faker->unique()->regexify('[a-zA-Z0-9_-]{11}'),
            'thumbnail_url' => $this->faker->imageUrl(),
            'duration_seconds' => $this->faker->numberBetween(60, 1800),
            'order' => $this->faker->numberBetween(0, 100),
        ];
    }
}

