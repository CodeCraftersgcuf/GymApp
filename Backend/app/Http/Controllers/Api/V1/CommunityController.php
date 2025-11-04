<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Community;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommunityController extends Controller
{
    /**
     * List all active social media links.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Community::where('is_active', true)
            ->orderBy('order')
            ->orderBy('id');

        $communities = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $communities->map(function ($community) {
                return [
                    'id' => $community->id,
                    'platform' => $community->platform,
                    'url' => $community->url,
                    'order' => $community->order,
                ];
            }),
            'meta' => [
                'current_page' => $communities->currentPage(),
                'per_page' => $communities->perPage(),
                'total' => $communities->total(),
                'last_page' => $communities->lastPage(),
            ],
            'links' => [
                'first' => $communities->url(1),
                'last' => $communities->url($communities->lastPage()),
                'prev' => $communities->previousPageUrl(),
                'next' => $communities->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show a single social media link with details.
     */
    public function show($id): JsonResponse
    {
        $community = Community::where('is_active', true)->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $community->id,
                'platform' => $community->platform,
                'url' => $community->url,
                'order' => $community->order,
            ],
        ]);
    }
}
