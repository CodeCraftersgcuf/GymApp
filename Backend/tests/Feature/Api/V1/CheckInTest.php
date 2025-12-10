<?php

namespace Tests\Feature\Api\V1;

use App\Models\CheckIn;
use App\Models\Program;
use App\Models\User;
use App\Models\UserProgram;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CheckInTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        Role::create(['name' => 'Coach']);
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'User']);
    }

    public function test_user_can_request_check_in()
    {
        $user = User::factory()->create();
        $user->assignRole('User');
        $token = $user->createToken('test-token')->plainTextToken;

        $coach = User::factory()->create();
        $coach->assignRole('Coach');

        $program = Program::factory()->create([
            'coach_id' => $coach->id,
        ]);

        UserProgram::factory()->create([
            'user_id' => $user->id,
            'program_id' => $program->id,
            'coach_id' => $coach->id,
            'status' => 'active',
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/check-ins', [
                'coach_id' => $coach->id,
                'scheduled_at' => now()->addDay()->toDateTimeString(),
                'notes' => 'Need guidance on form',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'scheduled_at',
                    'status',
                    'coach',
                ],
            ]);

        $this->assertDatabaseHas('check_ins', [
            'user_id' => $user->id,
            'coach_id' => $coach->id,
            'status' => 'pending',
        ]);
    }

    public function test_coach_can_complete_check_in()
    {
        $user = User::factory()->create();
        $coach = User::factory()->create();
        $coach->assignRole('Coach');
        $token = $coach->createToken('test-token')->plainTextToken;

        $checkIn = CheckIn::factory()->create([
            'user_id' => $user->id,
            'coach_id' => $coach->id,
            'status' => 'pending',
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/v1/coach/check-ins/{$checkIn->id}/complete", [
                'notes' => 'Great progress!',
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'status',
                    'completed_at',
                ],
            ]);

        $this->assertDatabaseHas('check_ins', [
            'id' => $checkIn->id,
            'status' => 'completed',
        ]);
    }
}

