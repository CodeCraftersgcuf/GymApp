<?php

namespace Tests\Feature\Api\V1;

use App\Models\NutritionLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NutritionLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_nutrition_log()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/nutrition-logs', [
                'logged_at' => now()->toDateString(),
                'kcal' => 2000,
                'protein_g' => 150.5,
                'carbs_g' => 200.0,
                'fats_g' => 65.5,
                'water_ml' => 2000,
                'notes' => 'Test nutrition log',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'logged_at',
                    'kcal',
                    'protein_g',
                    'carbs_g',
                    'fats_g',
                ],
            ]);

        $this->assertDatabaseHas('nutrition_logs', [
            'user_id' => $user->id,
            'kcal' => 2000,
        ]);
    }

    public function test_user_can_list_nutrition_logs()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        NutritionLog::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/nutrition-logs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'logged_at',
                        'kcal',
                    ],
                ],
            ]);
    }

    public function test_user_cannot_create_duplicate_nutrition_log()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $date = now()->toDateString();

        NutritionLog::factory()->create([
            'user_id' => $user->id,
            'logged_at' => $date,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/nutrition-logs', [
                'logged_at' => $date,
                'kcal' => 2000,
                'protein_g' => 150.5,
                'carbs_g' => 200.0,
                'fats_g' => 65.5,
            ]);

        $response->assertStatus(409)
            ->assertJson([
                'error' => 'duplicate_entry',
            ]);
    }
}

