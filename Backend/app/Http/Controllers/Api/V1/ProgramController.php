<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateProgramRequest;
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

        $this->authorize('view', $program);

        return new ProgramResource($program);
    }

    /**
     * Create a new program (Coach only).
     */
    public function store(CreateProgramRequest $request): JsonResponse
    {
        $this->authorize('create', Program::class);

        $validated = $request->validated();

        $program = Program::create([
            ...$validated,
            'coach_id' => auth()->id(),
        ]);

        return response()->json([
            'data' => new ProgramResource($program->load('coach')),
            'message' => 'Program created successfully.',
        ], 201);
    }
}
