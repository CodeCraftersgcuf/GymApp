<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
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
        $query = Banner::query();

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $banners = $query->orderBy('order')->latest()->paginate(15)->withQueryString();
        return view('admin.banners.index', compact('banners'));
    }

    public function create()
    {
        return view('admin.banners.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string',
            'link_url' => 'sometimes|nullable|url|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $banner = Banner::create([
            'title' => $validated['title'] ?? null,
            'description' => $validated['description'] ?? null,
            'link_url' => $validated['link_url'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $banner->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully.');
    }

    public function show(Banner $banner)
    {
        return view('admin.banners.show', compact('banner'));
    }

    public function edit(Banner $banner)
    {
        return view('admin.banners.edit', compact('banner'));
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string',
            'link_url' => 'sometimes|nullable|url|max:255',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $banner->update([
            'title' => $validated['title'] ?? $banner->title,
            'description' => $validated['description'] ?? $banner->description,
            'link_url' => $validated['link_url'] ?? $banner->link_url,
            'is_active' => $validated['is_active'] ?? $banner->is_active,
            'order' => $validated['order'] ?? $banner->order,
        ]);

        // Handle image upload (update)
        if ($request->hasFile('image')) {
            // Delete old image
            $banner->clearMediaCollection('images');
            // Add new image
            $banner->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }

        return redirect()->route('admin.banners.index')->with('success', 'Banner updated successfully.');
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        return redirect()->route('admin.banners.index')->with('success', 'Banner deleted successfully.');
    }
}
