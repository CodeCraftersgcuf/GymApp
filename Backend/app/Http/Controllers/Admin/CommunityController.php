<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Community;
use Illuminate\Http\Request;

class CommunityController extends Controller
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
        $query = Community::query();

        if ($request->has('search')) {
            $query->where('platform', 'like', "%{$request->search}%");
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $communities = $query->orderBy('order')->latest()->paginate(15)->withQueryString();
        return view('admin.communities.index', compact('communities'));
    }

    public function create()
    {
        return view('admin.communities.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        Community::create([
            'platform' => $validated['platform'],
            'url' => $validated['url'],
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
        ]);

        return redirect()->route('admin.communities.index')->with('success', 'Social media link created successfully.');
    }

    public function show(Community $community)
    {
        return view('admin.communities.show', compact('community'));
    }

    public function edit(Community $community)
    {
        return view('admin.communities.edit', compact('community'));
    }

    public function update(Request $request, Community $community)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'is_active' => 'sometimes|boolean',
            'order' => 'sometimes|integer|min:0',
        ]);

        $community->update([
            'platform' => $validated['platform'],
            'url' => $validated['url'],
            'is_active' => $validated['is_active'] ?? $community->is_active,
            'order' => $validated['order'] ?? $community->order,
        ]);

        return redirect()->route('admin.communities.index')->with('success', 'Social media link updated successfully.');
    }

    public function destroy(Community $community)
    {
        $community->delete();
        return redirect()->route('admin.communities.index')->with('success', 'Social media link deleted successfully.');
    }
}
