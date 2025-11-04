<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
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
        $query = Review::query();

        if ($request->has('search')) {
            $query->where('description', 'like', "%{$request->search}%");
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $reviews = $query->orderBy('order')->latest()->paginate(15)->withQueryString();
        return view('admin.reviews.index', compact('reviews'));
    }

    public function create()
    {
        return view('admin.reviews.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'sometimes|nullable|string',
            'video_link' => 'sometimes|nullable|url|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $review = Review::create([
            'description' => $validated['description'] ?? null,
            'video_link' => $validated['video_link'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $review->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return redirect()->route('admin.reviews.index')->with('success', 'Review created successfully.');
    }

    public function show(Review $review)
    {
        return view('admin.reviews.show', compact('review'));
    }

    public function edit(Review $review)
    {
        return view('admin.reviews.edit', compact('review'));
    }

    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'description' => 'sometimes|nullable|string',
            'video_link' => 'sometimes|nullable|url|max:255',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $review->update([
            'description' => $validated['description'] ?? $review->description,
            'video_link' => $validated['video_link'] ?? $review->video_link,
            'is_active' => $validated['is_active'] ?? $review->is_active,
            'order' => $validated['order'] ?? $review->order,
        ]);

        // Handle image upload (update)
        if ($request->hasFile('image')) {
            // Delete old image
            $review->clearMediaCollection('images');
            // Add new image
            $review->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return redirect()->route('admin.reviews.index')->with('success', 'Review updated successfully.');
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return redirect()->route('admin.reviews.index')->with('success', 'Review deleted successfully.');
    }
}
