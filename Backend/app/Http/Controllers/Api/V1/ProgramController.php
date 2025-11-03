<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProgramResource;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProgramController extends Controller
{
    /**
     * List public programs with filters.
     */
    public function index(Request $request)
    {
        $query = Program::where('is_public', true)
            ->with(['coach:id,name', 'phases.workouts.exercises']);

        if ($request->has('goal')) {
            $query->where('goal', $request->goal);
        }

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        $programs = $query->paginate($request->get('per_page', 15));

        return ProgramResource::collection($programs);
    }

    /**
     * Show a program with full details.
     */
    public function show($id)
    {
        $program = Program::with([
            'coach:id,name',
            'phases.workouts.exercises'
        ])->findOrFail($id);

        if (!$program->is_public && !auth()->check()) {
            abort(403);
        }

        return new ProgramResource($program);
    }

    /**
     * Create a new program (Coach only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'goal' => 'required|in:fat_loss,muscle_gain,maintenance,endurance,strength',
            'level' => 'required|in:beginner,intermediate,advanced',
            'duration_weeks' => 'required|integer|min:1',
            'is_public' => 'sometimes|boolean',
            'price_cents' => 'sometimes|nullable|integer|min:0',
            'description' => 'sometimes|nullable|string',
        ]);

        $program = Program::create([
            ...$validated,
            'coach_id' => auth()->id(),
        ]);

        return new ProgramResource($program->load('coach'));
    }
}
