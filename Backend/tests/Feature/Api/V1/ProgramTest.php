<?php

namespace Tests\Feature\Api\V1;

use App\Models\Program;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProgramTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create roles
        Role::create(['name' => 'Coach']);
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'User']);
    }

    public function test_public_can_view_public_programs()
    {
        Program::factory()->create([
            'is_public' => true,
            'title' => 'Public Program',
        ]);

        $response = $this->getJson('/api/v1/programs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'goal',
                        'level',
                    ],
                ],
            ]);
    }

    public function test_coach_can_create_program()
    {
        $coach = User::factory()->create();
        $coach->assignRole('Coach');
        $token = $coach->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/coach/programs', [
                'title' => 'New Program',
                'goal' => 'muscle_gain',
                'level' => 'intermediate',
                'duration_weeks' => 12,
                'is_public' => true,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'goal',
                    'level',
                ],
            ]);

        $this->assertDatabaseHas('programs', [
            'title' => 'New Program',
            'coach_id' => $coach->id,
        ]);
    }

    public function test_user_cannot_create_program()
    {
        $user = User::factory()->create();
        $user->assignRole('User');
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/coach/programs', [
                'title' => 'New Program',
                'goal' => 'muscle_gain',
                'level' => 'intermediate',
                'duration_weeks' => 12,
            ]);

        $response->assertStatus(403);
    }

    public function test_user_can_view_public_program_details()
    {
        $program = Program::factory()->create([
            'is_public' => true,
        ]);

        $response = $this->getJson("/api/v1/programs/{$program->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'goal',
                    'level',
                ],
            ]);
    }
}

