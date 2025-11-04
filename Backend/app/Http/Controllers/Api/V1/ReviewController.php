<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    /**
     * List all active reviews.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Review::where('is_active', true)
            ->orderBy('order')
            ->orderBy('id');

        $reviews = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'description' => $review->description,
                    'image_url' => $review->getFirstMediaUrl('images'),
                    'video_link' => $review->video_link,
                    'order' => $review->order,
                ];
            }),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
                'last_page' => $reviews->lastPage(),
            ],
            'links' => [
                'first' => $reviews->url(1),
                'last' => $reviews->url($reviews->lastPage()),
                'prev' => $reviews->previousPageUrl(),
                'next' => $reviews->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show a single review with details.
     */
    public function show($id): JsonResponse
    {
        $review = Review::where('is_active', true)->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $review->id,
                'description' => $review->description,
                'image_url' => $review->getFirstMediaUrl('images'),
                'video_link' => $review->video_link,
                'order' => $review->order,
            ],
        ]);
    }
}
