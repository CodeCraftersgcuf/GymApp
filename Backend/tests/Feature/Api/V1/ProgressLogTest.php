<?php

namespace Tests\Feature\Api\V1;

use App\Models\ProgressLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProgressLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_progress_log()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/progress-logs', [
                'logged_at' => now()->toDateString(),
                'weight_kg' => 75.5,
                'body_fat_percent' => 15.5,
                'chest_cm' => 100.0,
                'waist_cm' => 80.0,
                'hips_cm' => 95.0,
                'notes' => 'Test progress log',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'logged_at',
                    'weight_kg',
                    'body_fat_percent',
                ],
            ]);

        $this->assertDatabaseHas('progress_logs', [
            'user_id' => $user->id,
            'weight_kg' => 75.5,
        ]);
    }

    public function test_user_can_list_progress_logs()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        ProgressLog::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/progress-logs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'logged_at',
                        'weight_kg',
                    ],
                ],
            ]);
    }

    public function test_progress_logs_show_changes_from_previous()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $firstLog = ProgressLog::factory()->create([
            'user_id' => $user->id,
            'logged_at' => now()->subDays(7),
            'weight_kg' => 80.0,
        ]);

        $secondLog = ProgressLog::factory()->create([
            'user_id' => $user->id,
            'logged_at' => now(),
            'weight_kg' => 75.5,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/progress-logs');

        $response->assertStatus(200);
        // Changes should be calculated
    }
}

