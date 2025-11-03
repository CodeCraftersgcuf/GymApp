<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\PlanVideo;
use Illuminate\Http\Request;

class PlanController extends Controller
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
        $query = Plan::withCount('videos');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $plans = $query->orderBy('order')->latest()->paginate(15)->withQueryString();
        return view('admin.plans.index', compact('plans'));
    }

    public function create()
    {
        return view('admin.plans.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'image_url' => 'sometimes|nullable|url',
            'category' => 'required|in:weight_loss,muscle_gain,endurance,flexibility,strength,general',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'duration_weeks' => 'sometimes|nullable|integer|min:1',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $plan = Plan::create($validated);
        return redirect()->route('admin.plans.show', $plan)->with('success', 'Plan created successfully.');
    }

    public function show(Plan $plan)
    {
        $plan->load('videos');
        return view('admin.plans.show', compact('plan'));
    }

    public function edit(Plan $plan)
    {
        return view('admin.plans.edit', compact('plan'));
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'image_url' => 'sometimes|nullable|url',
            'category' => 'required|in:weight_loss,muscle_gain,endurance,flexibility,strength,general',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'duration_weeks' => 'sometimes|nullable|integer|min:1',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $plan->update($validated);
        return redirect()->route('admin.plans.show', $plan)->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return redirect()->route('admin.plans.index')->with('success', 'Plan deleted successfully.');
    }

    public function storeVideo(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'youtube_url' => 'required|url',
            'thumbnail_url' => 'sometimes|nullable|url',
            'duration_seconds' => 'sometimes|nullable|integer|min:0',
            'order' => 'sometimes|integer|min:0',
        ]);

        $plan->videos()->create($validated);
        return redirect()->route('admin.plans.show', $plan)->with('success', 'Video added successfully.');
    }

    public function updateVideo(Request $request, Plan $plan, PlanVideo $video)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'youtube_url' => 'required|url',
            'thumbnail_url' => 'sometimes|nullable|url',
            'duration_seconds' => 'sometimes|nullable|integer|min:0',
            'order' => 'sometimes|integer|min:0',
        ]);

        $video->update($validated);
        return redirect()->route('admin.plans.show', $plan)->with('success', 'Video updated successfully.');
    }

    public function destroyVideo(Plan $plan, PlanVideo $video)
    {
        $video->delete();
        return redirect()->route('admin.plans.show', $plan)->with('success', 'Video deleted successfully.');
    }
}

