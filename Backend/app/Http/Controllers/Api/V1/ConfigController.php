<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ConfigController extends Controller
{
    /**
     * Get basic app configuration.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'app_name' => config('app.name'),
                'features' => [
                    'workouts' => true,
                    'nutrition' => true,
                    'progress_tracking' => true,
                    'coaching' => true,
                    'payments' => true,
                ],
                'supported_locales' => ['en', 'es', 'fr', 'de'],
                'goal_options' => ['fat_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength'],
                'program_levels' => ['beginner', 'intermediate', 'advanced'],
            ],
        ]);
    }
}
