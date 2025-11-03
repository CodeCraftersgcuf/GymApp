<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!auth()->check() || !auth()->user()->hasRole('Admin')) {
                abort(403);
            }
            return $next($request);
        });
    }

    public function index(Request $request)
    {
        $query = Exercise::query();

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->has('equipment')) {
            $query->where('equipment', $request->equipment);
        }

        if ($request->has('primary_muscle')) {
            $query->where('primary_muscle', $request->primary_muscle);
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        $exercises = $query->latest()->paginate(15)->withQueryString();
        return view('admin.exercises.index', compact('exercises'));
    }

    public function create()
    {
        return view('admin.exercises.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'equipment' => 'required|in:bodyweight,dumbbells,barbell,kettlebell,machine,cables,resistance_bands,other',
            'primary_muscle' => 'required|in:chest,back,shoulders,arms,legs,core,cardio,full_body',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'description' => 'sometimes|nullable|string',
            'video_url' => 'sometimes|nullable|url',
            'instructions' => 'sometimes|nullable|string',
        ]);

        Exercise::create($validated);
        return redirect()->route('admin.exercises.index')->with('success', 'Exercise created successfully.');
    }

    public function show(Exercise $exercise)
    {
        return view('admin.exercises.show', compact('exercise'));
    }

    public function edit(Exercise $exercise)
    {
        return view('admin.exercises.edit', compact('exercise'));
    }

    public function update(Request $request, Exercise $exercise)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'equipment' => 'required|in:bodyweight,dumbbells,barbell,kettlebell,machine,cables,resistance_bands,other',
            'primary_muscle' => 'required|in:chest,back,shoulders,arms,legs,core,cardio,full_body',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'description' => 'sometimes|nullable|string',
            'video_url' => 'sometimes|nullable|url',
            'instructions' => 'sometimes|nullable|string',
        ]);

        $exercise->update($validated);
        return redirect()->route('admin.exercises.index')->with('success', 'Exercise updated successfully.');
    }

    public function destroy(Exercise $exercise)
    {
        $exercise->delete();
        return redirect()->route('admin.exercises.index')->with('success', 'Exercise deleted successfully.');
    }
}

