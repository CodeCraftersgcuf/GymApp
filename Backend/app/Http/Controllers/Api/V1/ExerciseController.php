<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExerciseController extends Controller
{
    /**
     * List all exercises with filters.
     */
    public function index(Request $request)
    {
        $query = Exercise::query();

        if ($request->has('equipment')) {
            $query->where('equipment', $request->equipment);
        }

        if ($request->has('primary_muscle')) {
            $query->where('primary_muscle', $request->primary_muscle);
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $exercises = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $exercises->map(function ($exercise) {
                return [
                    'id' => $exercise->id,
                    'title' => $exercise->title,
                    'equipment' => $exercise->equipment,
                    'primary_muscle' => $exercise->primary_muscle,
                    'difficulty' => $exercise->difficulty,
                    'description' => $exercise->description,
                    'video_url' => $exercise->video_url,
                    'instructions' => $exercise->instructions,
                ];
            }),
            'meta' => [
                'current_page' => $exercises->currentPage(),
                'per_page' => $exercises->perPage(),
                'total' => $exercises->total(),
            ],
            'links' => [
                'first' => $exercises->url(1),
                'last' => $exercises->url($exercises->lastPage()),
                'prev' => $exercises->previousPageUrl(),
                'next' => $exercises->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show a single exercise with details.
     */
    public function show($id): JsonResponse
    {
        $exercise = Exercise::findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $exercise->id,
                'title' => $exercise->title,
                'equipment' => $exercise->equipment,
                'primary_muscle' => $exercise->primary_muscle,
                'difficulty' => $exercise->difficulty,
                'description' => $exercise->description,
                'video_url' => $exercise->video_url,
                'instructions' => $exercise->instructions,
            ],
        ]);
    }
}

