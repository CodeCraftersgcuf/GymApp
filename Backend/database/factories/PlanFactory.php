<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanFactory extends Factory
{
    protected $model = Plan::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'image_url' => $this->faker->imageUrl(),
            'category' => $this->faker->randomElement(['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'strength', 'general']),
            'difficulty' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'duration_weeks' => $this->faker->numberBetween(4, 12),
            'is_active' => true,
            'order' => $this->faker->numberBetween(0, 100),
        ];
    }
}

