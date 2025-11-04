<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\JsonResponse;

class ConfigController extends Controller
{
    /**
     * Get basic app configuration.
     */
    public function index(): JsonResponse
    {
        $whatsappNumber = Settings::get('whatsapp_support_number');

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
                'whatsapp_support_number' => $whatsappNumber,
                'whatsapp_support_link' => $whatsappNumber ? 'https://wa.me/' . preg_replace('/[^0-9]/', '', $whatsappNumber) : null,
            ],
        ]);
    }
}
