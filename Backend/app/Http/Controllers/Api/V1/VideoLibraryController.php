<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\VideoLibrary;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VideoLibraryController extends Controller
{
    /**
     * List all active video libraries with their items.
     */
    public function index(Request $request): JsonResponse
    {
        $query = VideoLibrary::where('is_active', true)
            ->with('items')
            ->orderBy('order')
            ->orderBy('id');

        $videoLibraries = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $videoLibraries->map(function ($library) {
                return [
                    'id' => $library->id,
                    'title' => $library->title,
                    'description' => $library->description,
                    'image_url' => $library->getFirstMediaUrl('images'),
                    'order' => $library->order,
                    'items_count' => $library->items->count(),
                    'items' => $library->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'title' => $item->title,
                            'youtube_url' => $item->youtube_url,
                            'youtube_id' => $item->youtube_id,
                            'description' => $item->description,
                            'notes' => $item->notes,
                            'order' => $item->order,
                        ];
                    }),
                ];
            }),
            'meta' => [
                'current_page' => $videoLibraries->currentPage(),
                'per_page' => $videoLibraries->perPage(),
                'total' => $videoLibraries->total(),
                'last_page' => $videoLibraries->lastPage(),
            ],
            'links' => [
                'first' => $videoLibraries->url(1),
                'last' => $videoLibraries->url($videoLibraries->lastPage()),
                'prev' => $videoLibraries->previousPageUrl(),
                'next' => $videoLibraries->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show a single video library with all its items.
     */
    public function show($id): JsonResponse
    {
        $videoLibrary = VideoLibrary::where('is_active', true)
            ->with('items')
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $videoLibrary->id,
                'title' => $videoLibrary->title,
                'description' => $videoLibrary->description,
                'image_url' => $videoLibrary->getFirstMediaUrl('images'),
                'order' => $videoLibrary->order,
                'items' => $videoLibrary->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'youtube_url' => $item->youtube_url,
                        'youtube_id' => $item->youtube_id,
                        'description' => $item->description,
                        'notes' => $item->notes,
                        'order' => $item->order,
                    ];
                }),
            ],
        ]);
    }
}
