<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Coach;
use App\Models\Program;
use App\Models\Phase;
use App\Models\Workout;
use App\Models\Exercise;
use App\Models\Product;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $coachRole = Role::firstOrCreate(['name' => 'Coach', 'guard_name' => 'web']);
        $userRole = Role::firstOrCreate(['name' => 'User', 'guard_name' => 'web']);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@fitness.app'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole($adminRole);

        // Create coach users
        $coach1 = User::firstOrCreate(
            ['email' => 'coach1@fitness.app'],
            [
                'name' => 'John Coach',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'gender' => 'male',
                'goal' => 'muscle_gain',
            ]
        );
        $coach1->assignRole($coachRole);

        Coach::firstOrCreate(
            ['user_id' => $coach1->id],
            [
                'bio' => 'Certified personal trainer with 10 years of experience',
                'certifications' => ['NASM-CPT', 'CrossFit Level 1'],
                'specialties' => ['Strength Training', 'Bodybuilding'],
            ]
        );

        $coach2 = User::firstOrCreate(
            ['email' => 'coach2@fitness.app'],
            [
                'name' => 'Jane Trainer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'gender' => 'female',
                'goal' => 'fat_loss',
            ]
        );
        $coach2->assignRole($coachRole);

        Coach::firstOrCreate(
            ['user_id' => $coach2->id],
            [
                'bio' => 'Nutrition and fitness expert',
                'certifications' => ['ACE-CPT', 'Precision Nutrition'],
                'specialties' => ['Fat Loss', 'Nutrition Coaching'],
            ]
        );

        // Create sample users
        User::factory(20)->create()->each(function ($user) use ($userRole) {
            $user->assignRole($userRole);
        });

        // Create sample exercises
        $exercises = collect([
            ['title' => 'Push-ups', 'equipment' => 'bodyweight', 'primary_muscle' => 'chest', 'difficulty' => 'beginner'],
            ['title' => 'Pull-ups', 'equipment' => 'bodyweight', 'primary_muscle' => 'back', 'difficulty' => 'intermediate'],
            ['title' => 'Squats', 'equipment' => 'bodyweight', 'primary_muscle' => 'legs', 'difficulty' => 'beginner'],
            ['title' => 'Deadlift', 'equipment' => 'barbell', 'primary_muscle' => 'back', 'difficulty' => 'advanced'],
            ['title' => 'Bench Press', 'equipment' => 'barbell', 'primary_muscle' => 'chest', 'difficulty' => 'intermediate'],
            ['title' => 'Overhead Press', 'equipment' => 'barbell', 'primary_muscle' => 'shoulders', 'difficulty' => 'intermediate'],
            ['title' => 'Barbell Row', 'equipment' => 'barbell', 'primary_muscle' => 'back', 'difficulty' => 'intermediate'],
            ['title' => 'Dumbbell Curl', 'equipment' => 'dumbbells', 'primary_muscle' => 'arms', 'difficulty' => 'beginner'],
            ['title' => 'Plank', 'equipment' => 'bodyweight', 'primary_muscle' => 'core', 'difficulty' => 'beginner'],
            ['title' => 'Running', 'equipment' => 'bodyweight', 'primary_muscle' => 'cardio', 'difficulty' => 'beginner'],
        ])->map(fn($data) => Exercise::create($data));

        // Create programs
        $program1 = Program::create([
            'coach_id' => $coach1->id,
            'title' => '12-Week Muscle Building',
            'goal' => 'muscle_gain',
            'level' => 'intermediate',
            'duration_weeks' => 12,
            'is_public' => true,
            'price_cents' => 9900,
            'description' => 'Comprehensive muscle building program',
        ]);

        $phase1 = Phase::create([
            'program_id' => $program1->id,
            'title' => 'Foundation Phase',
            'order' => 1,
        ]);

        // Create workouts for phase 1
        $workout1 = Workout::create([
            'phase_id' => $phase1->id,
            'title' => 'Upper Body Strength',
            'day_of_week' => 1, // Monday
            'order' => 1,
        ]);

        $workout1->exercises()->attach([
            $exercises->random()->id => ['sets' => 4, 'reps_min' => 8, 'reps_max' => 10, 'rest_seconds' => 90, 'order' => 1],
            $exercises->random()->id => ['sets' => 3, 'reps_min' => 10, 'reps_max' => 12, 'rest_seconds' => 60, 'order' => 2],
            $exercises->random()->id => ['sets' => 3, 'reps_min' => 12, 'reps_max' => 15, 'rest_seconds' => 45, 'order' => 3],
        ]);

        // Create products
        Product::create([
            'slug' => '3-month-muscle-gain',
            'name' => '3-Month Muscle Gain Program',
            'description' => 'Full 3-month program with coaching',
            'price_cents' => 9900,
            'interval' => 'one_time',
            'active' => true,
            'features' => ['Program Access', 'Weekly Check-ins', 'Nutrition Plan'],
        ]);

        Product::create([
            'slug' => 'monthly-coaching',
            'name' => 'Monthly Coaching Subscription',
            'description' => 'Ongoing monthly coaching',
            'price_cents' => 4900,
            'interval' => 'monthly',
            'active' => true,
            'features' => ['Personalized Plans', 'Daily Support', 'Progress Tracking'],
        ]);
    }
}
