<?php

namespace Tests\Feature\Api\V1;

use App\Models\Program;
use App\Models\User;
use App\Models\UserProgram;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserProgramTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        Role::create(['name' => 'Coach']);
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'User']);
    }

    public function test_user_can_subscribe_to_program()
    {
        $user = User::factory()->create();
        $user->assignRole('User');
        $token = $user->createToken('test-token')->plainTextToken;

        $coach = User::factory()->create();
        $coach->assignRole('Coach');

        $program = Program::factory()->create([
            'is_public' => true,
            'coach_id' => $coach->id,
            'duration_weeks' => 12,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/user-programs', [
                'program_id' => $program->id,
                'coach_id' => $coach->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'status',
                    'program',
                    'coach',
                ],
            ]);

        $this->assertDatabaseHas('user_programs', [
            'user_id' => $user->id,
            'program_id' => $program->id,
            'status' => 'active',
        ]);
    }

    public function test_user_can_list_subscribed_programs()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        UserProgram::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/user-programs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'status',
                        'program',
                    ],
                ],
            ]);
    }

    public function test_user_cannot_subscribe_twice_to_same_program()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $program = Program::factory()->create([
            'is_public' => true,
        ]);

        UserProgram::factory()->create([
            'user_id' => $user->id,
            'program_id' => $program->id,
            'status' => 'active',
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/user-programs', [
                'program_id' => $program->id,
            ]);

        $response->assertStatus(409)
            ->assertJson([
                'error' => 'already_subscribed',
            ]);
    }
}

