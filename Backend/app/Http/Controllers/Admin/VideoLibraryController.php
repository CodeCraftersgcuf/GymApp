<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VideoLibrary;
use App\Models\VideoLibraryItem;
use Illuminate\Http\Request;

class VideoLibraryController extends Controller
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
        $query = VideoLibrary::withCount('items');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $videoLibraries = $query->orderBy('order')->latest()->paginate(15)->withQueryString();
        return view('admin.video-libraries.index', compact('videoLibraries'));
    }

    public function create()
    {
        return view('admin.video-libraries.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $videoLibrary = VideoLibrary::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $videoLibrary->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return redirect()->route('admin.video-libraries.show', $videoLibrary)->with('success', 'Video library created successfully.');
    }

    public function show(VideoLibrary $videoLibrary)
    {
        $videoLibrary->load('items');
        return view('admin.video-libraries.show', compact('videoLibrary'));
    }

    public function edit(VideoLibrary $videoLibrary)
    {
        return view('admin.video-libraries.edit', compact('videoLibrary'));
    }

    public function update(Request $request, VideoLibrary $videoLibrary)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $videoLibrary->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? $videoLibrary->is_active,
            'order' => $validated['order'] ?? $videoLibrary->order,
        ]);

        // Handle image upload (update)
        if ($request->hasFile('image')) {
            // Delete old image
            $videoLibrary->clearMediaCollection('images');
            // Add new image
            $videoLibrary->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return redirect()->route('admin.video-libraries.show', $videoLibrary)->with('success', 'Video library updated successfully.');
    }

    public function destroy(VideoLibrary $videoLibrary)
    {
        $videoLibrary->delete();
        return redirect()->route('admin.video-libraries.index')->with('success', 'Video library deleted successfully.');
    }

    // Methods for managing video items
    public function storeItem(Request $request, VideoLibrary $videoLibrary)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'youtube_url' => 'required|url',
            'description' => 'sometimes|nullable|string',
            'notes' => 'sometimes|nullable|string',
            'order' => 'sometimes|integer|min:0',
        ]);

        $videoLibrary->items()->create($validated);
        return redirect()->route('admin.video-libraries.show', $videoLibrary)->with('success', 'Video item added successfully.');
    }

    public function updateItem(Request $request, VideoLibrary $videoLibrary, VideoLibraryItem $item)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'youtube_url' => 'required|url',
            'description' => 'sometimes|nullable|string',
            'notes' => 'sometimes|nullable|string',
            'order' => 'sometimes|integer|min:0',
        ]);

        $item->update($validated);
        return redirect()->route('admin.video-libraries.show', $videoLibrary)->with('success', 'Video item updated successfully.');
    }

    public function destroyItem(VideoLibrary $videoLibrary, VideoLibraryItem $item)
    {
        $item->delete();
        return redirect()->route('admin.video-libraries.show', $videoLibrary)->with('success', 'Video item deleted successfully.');
    }
}
