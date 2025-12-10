<?php

namespace Tests\Feature\Api\V1;

use App\Models\Food;
use App\Models\MealPlan;
use App\Models\Program;
use App\Models\User;
use App\Models\UserProgram;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CoachTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        Role::create(['name' => 'Coach']);
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'User']);
    }

    public function test_coach_can_list_clients()
    {
        $coach = User::factory()->create();
        $coach->assignRole('Coach');
        $token = $coach->createToken('test-token')->plainTextToken;

        $client = User::factory()->create();
        $client->assignRole('User');

        UserProgram::factory()->create([
            'user_id' => $client->id,
            'coach_id' => $coach->id,
            'status' => 'active',
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/coach/clients');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'email',
                    ],
                ],
            ]);
    }

    public function test_coach_can_view_client_overview()
    {
        $coach = User::factory()->create();
        $coach->assignRole('Coach');
        $token = $coach->createToken('test-token')->plainTextToken;

        $client = User::factory()->create();
        $client->assignRole('User');

        UserProgram::factory()->create([
            'user_id' => $client->id,
            'coach_id' => $coach->id,
            'status' => 'active',
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/v1/coach/clients/{$client->id}/overview");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'user',
                    'active_programs',
                    'statistics',
                ],
            ]);
    }

    public function test_coach_can_create_meal_plan()
    {
        $coach = User::factory()->create();
        $coach->assignRole('Coach');
        $token = $coach->createToken('test-token')->plainTextToken;

        $client = User::factory()->create();
        $client->assignRole('User');

        UserProgram::factory()->create([
            'user_id' => $client->id,
            'coach_id' => $coach->id,
            'status' => 'active',
        ]);

        $food = Food::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/coach/meal-plans', [
                'user_id' => $client->id,
                'title' => 'Cutting Meal Plan',
                'kcal_target' => 2000,
                'protein_target_g' => 150.0,
                'carbs_target_g' => 200.0,
                'fats_target_g' => 65.0,
                'meals' => [
                    [
                        'title' => 'Breakfast',
                        'meal_type' => 'breakfast',
                        'order' => 0,
                        'items' => [
                            [
                                'food_id' => $food->id,
                                'servings' => 2.0,
                                'order' => 0,
                            ],
                        ],
                    ],
                ],
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'meals',
                ],
            ]);

        $this->assertDatabaseHas('meal_plans', [
            'user_id' => $client->id,
            'coach_id' => $coach->id,
            'title' => 'Cutting Meal Plan',
        ]);
    }
}

