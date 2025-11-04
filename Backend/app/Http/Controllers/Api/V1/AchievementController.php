<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AchievementController extends Controller
{
    /**
     * List all active achievements with their videos.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Achievement::where('is_active', true)
            ->with('videos')
            ->orderBy('order')
            ->orderBy('id');

        $achievements = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $achievements->map(function ($achievement) {
                return [
                    'id' => $achievement->id,
                    'user_name' => $achievement->user_name,
                    'bio' => $achievement->bio,
                    'profile_picture_url' => $achievement->getFirstMediaUrl('profile_pictures'),
                    'order' => $achievement->order,
                    'videos_count' => $achievement->videos->count(),
                    'videos' => $achievement->videos->map(function ($video) {
                        return [
                            'id' => $video->id,
                            'youtube_url' => $video->youtube_url,
                            'youtube_id' => $video->youtube_id,
                            'order' => $video->order,
                        ];
                    }),
                ];
            }),
            'meta' => [
                'current_page' => $achievements->currentPage(),
                'per_page' => $achievements->perPage(),
                'total' => $achievements->total(),
                'last_page' => $achievements->lastPage(),
            ],
            'links' => [
                'first' => $achievements->url(1),
                'last' => $achievements->url($achievements->lastPage()),
                'prev' => $achievements->previousPageUrl(),
                'next' => $achievements->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show a single achievement with all its videos.
     */
    public function show($id): JsonResponse
    {
        $achievement = Achievement::where('is_active', true)
            ->with('videos')
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $achievement->id,
                'user_name' => $achievement->user_name,
                'bio' => $achievement->bio,
                'profile_picture_url' => $achievement->getFirstMediaUrl('profile_pictures'),
                'order' => $achievement->order,
                'videos' => $achievement->videos->map(function ($video) {
                    return [
                        'id' => $video->id,
                        'youtube_url' => $video->youtube_url,
                        'youtube_id' => $video->youtube_id,
                        'order' => $video->order,
                    ];
                }),
            ],
        ]);
    }
}
