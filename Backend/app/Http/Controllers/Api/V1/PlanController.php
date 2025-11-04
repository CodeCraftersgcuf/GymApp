<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    /**
     * List all active plans.
     */
    public function index(Request $request)
    {
        $query = Plan::where('is_active', true)
            ->with('videos')
            ->orderBy('order');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        $plans = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $plans->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'title' => $plan->title,
                    'description' => $plan->description,
                    'image_url' => $plan->image_url,
                    'category' => $plan->category,
                    'difficulty' => $plan->difficulty,
                    'duration_weeks' => $plan->duration_weeks,
                    'videos_count' => $plan->videos->count(),
                    'videos' => $plan->videos->map(function ($video) {
                        return [
                            'id' => $video->id,
                            'title' => $video->title,
                            'description' => $video->description,
                            'youtube_url' => $video->youtube_url,
                            'youtube_id' => $video->youtube_id,
                            'thumbnail_url' => $video->thumbnail_url,
                            'duration_seconds' => $video->duration_seconds,
                            'order' => $video->order,
                        ];
                    }),
                ];
            }),
            'meta' => [
                'current_page' => $plans->currentPage(),
                'per_page' => $plans->perPage(),
                'total' => $plans->total(),
            ],
            'links' => [
                'first' => $plans->url(1),
                'last' => $plans->url($plans->lastPage()),
                'prev' => $plans->previousPageUrl(),
                'next' => $plans->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show a plan with all videos.
     */
    public function show($id): JsonResponse
    {
        $plan = Plan::where('is_active', true)
            ->with('videos')
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $plan->id,
                'title' => $plan->title,
                'description' => $plan->description,
                'image_url' => $plan->image_url,
                'category' => $plan->category,
                'difficulty' => $plan->difficulty,
                'duration_weeks' => $plan->duration_weeks,
                'videos' => $plan->videos->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'title' => $video->title,
                        'description' => $video->description,
                        'youtube_url' => $video->youtube_url,
                        'youtube_id' => $video->youtube_id,
                        'thumbnail_url' => $video->thumbnail_url,
                        'duration_seconds' => $video->duration_seconds,
                        'order' => $video->order,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Get my plans (premium users only).
     * This endpoint is restricted to premium users and provides access to all plans with videos.
     */
    public function myPlans(Request $request)
    {
        $user = auth()->user();

        if (!$user->isPremium()) {
            return response()->json([
                'error' => 'Premium access required',
                'message' => 'You need a premium account to access your plans.',
                'user_type' => $user->user_type ?? 'simple',
            ], 403);
        }

        $query = Plan::where('is_active', true)
            ->with('videos')
            ->orderBy('order');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        $plans = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $plans->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'title' => $plan->title,
                    'description' => $plan->description,
                    'image_url' => $plan->image_url,
                    'category' => $plan->category,
                    'difficulty' => $plan->difficulty,
                    'duration_weeks' => $plan->duration_weeks,
                    'videos_count' => $plan->videos->count(),
                    'videos' => $plan->videos->map(function ($video) {
                        return [
                            'id' => $video->id,
                            'title' => $video->title,
                            'description' => $video->description,
                            'youtube_url' => $video->youtube_url,
                            'youtube_id' => $video->youtube_id,
                            'thumbnail_url' => $video->thumbnail_url,
                            'duration_seconds' => $video->duration_seconds,
                            'order' => $video->order,
                        ];
                    }),
                ];
            }),
            'meta' => [
                'current_page' => $plans->currentPage(),
                'per_page' => $plans->perPage(),
                'total' => $plans->total(),
            ],
            'links' => [
                'first' => $plans->url(1),
                'last' => $plans->url($plans->lastPage()),
                'prev' => $plans->previousPageUrl(),
                'next' => $plans->nextPageUrl(),
            ],
        ]);
    }
}

