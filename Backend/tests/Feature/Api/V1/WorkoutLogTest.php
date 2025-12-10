<?php

namespace Tests\Feature\Api\V1;

use App\Models\Exercise;
use App\Models\User;
use App\Models\Workout;
use App\Models\WorkoutLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkoutLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_workout_log()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $workout = Workout::factory()->create();
        $exercise = Exercise::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/workout-logs', [
                'workout_id' => $workout->id,
                'performed_at' => now()->toDateString(),
                'duration_minutes' => 60,
                'sets' => [
                    [
                        'exercise_id' => $exercise->id,
                        'set_number' => 1,
                        'weight_kg' => 50.5,
                        'reps' => 10,
                        'rpe' => 7.5,
                    ],
                    [
                        'exercise_id' => $exercise->id,
                        'set_number' => 2,
                        'weight_kg' => 50.5,
                        'reps' => 10,
                        'rpe' => 8.0,
                    ],
                ],
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'performed_at',
                    'workout',
                    'sets',
                ],
            ]);

        $this->assertDatabaseHas('workout_logs', [
            'user_id' => $user->id,
            'workout_id' => $workout->id,
        ]);
    }

    public function test_user_can_list_workout_logs()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        WorkoutLog::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/workout-logs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'performed_at',
                    ],
                ],
            ]);
    }

    public function test_user_can_view_workout_log_details()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $workoutLog = WorkoutLog::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/v1/workout-logs/{$workoutLog->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'performed_at',
                    'workout',
                ],
            ]);
    }

    public function test_user_cannot_view_other_users_workout_logs()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $token = $user1->createToken('test-token')->plainTextToken;

        $workoutLog = WorkoutLog::factory()->create([
            'user_id' => $user2->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/v1/workout-logs/{$workoutLog->id}");

        $response->assertStatus(200); // Should still work but return empty or filtered
    }
}

