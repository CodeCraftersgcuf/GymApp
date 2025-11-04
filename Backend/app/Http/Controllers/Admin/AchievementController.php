<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\AchievementVideo;
use Illuminate\Http\Request;

class AchievementController extends Controller
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
        $query = Achievement::withCount('videos');

        if ($request->has('search')) {
            $query->where('user_name', 'like', "%{$request->search}%");
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $achievements = $query->orderBy('order')->latest()->paginate(15)->withQueryString();
        return view('admin.achievements.index', compact('achievements'));
    }

    public function create()
    {
        return view('admin.achievements.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'bio' => 'sometimes|nullable|string',
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $achievement = Achievement::create([
            'user_name' => $validated['user_name'],
            'bio' => $validated['bio'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $achievement->addMediaFromRequest('profile_picture')
                ->toMediaCollection('profile_pictures');
        }

        return redirect()->route('admin.achievements.show', $achievement)->with('success', 'Achievement created successfully.');
    }

    public function show(Achievement $achievement)
    {
        $achievement->load('videos');
        return view('admin.achievements.show', compact('achievement'));
    }

    public function edit(Achievement $achievement)
    {
        return view('admin.achievements.edit', compact('achievement'));
    }

    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'bio' => 'sometimes|nullable|string',
            'profile_picture' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $achievement->update([
            'user_name' => $validated['user_name'],
            'bio' => $validated['bio'] ?? null,
            'is_active' => $validated['is_active'] ?? $achievement->is_active,
            'order' => $validated['order'] ?? $achievement->order,
        ]);

        // Handle profile picture upload (update)
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture
            $achievement->clearMediaCollection('profile_pictures');
            // Add new profile picture
            $achievement->addMediaFromRequest('profile_picture')
                ->toMediaCollection('profile_pictures');
        }

        return redirect()->route('admin.achievements.show', $achievement)->with('success', 'Achievement updated successfully.');
    }

    public function destroy(Achievement $achievement)
    {
        $achievement->delete();
        return redirect()->route('admin.achievements.index')->with('success', 'Achievement deleted successfully.');
    }

    // Methods for managing achievement videos
    public function storeVideo(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'youtube_url' => 'required|url',
            'order' => 'sometimes|integer|min:0',
        ]);

        $achievement->videos()->create($validated);
        return redirect()->route('admin.achievements.show', $achievement)->with('success', 'Video added successfully.');
    }

    public function updateVideo(Request $request, Achievement $achievement, AchievementVideo $video)
    {
        $validated = $request->validate([
            'youtube_url' => 'required|url',
            'order' => 'sometimes|integer|min:0',
        ]);

        $video->update($validated);
        return redirect()->route('admin.achievements.show', $achievement)->with('success', 'Video updated successfully.');
    }

    public function destroyVideo(Achievement $achievement, AchievementVideo $video)
    {
        $video->delete();
        return redirect()->route('admin.achievements.show', $achievement)->with('success', 'Video deleted successfully.');
    }
}
