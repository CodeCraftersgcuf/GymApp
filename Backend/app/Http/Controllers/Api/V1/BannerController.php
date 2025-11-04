<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BannerController extends Controller
{
    /**
     * List all active banners.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Banner::where('is_active', true)
            ->orderBy('order')
            ->orderBy('id');

        $banners = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $banners->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'title' => $banner->title,
                    'description' => $banner->description,
                    'image_url' => $banner->getFirstMediaUrl('images'),
                    'link_url' => $banner->link_url,
                    'order' => $banner->order,
                ];
            }),
            'meta' => [
                'current_page' => $banners->currentPage(),
                'per_page' => $banners->perPage(),
                'total' => $banners->total(),
                'last_page' => $banners->lastPage(),
            ],
            'links' => [
                'first' => $banners->url(1),
                'last' => $banners->url($banners->lastPage()),
                'prev' => $banners->previousPageUrl(),
                'next' => $banners->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show a single banner with details.
     */
    public function show($id): JsonResponse
    {
        $banner = Banner::where('is_active', true)->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $banner->id,
                'title' => $banner->title,
                'description' => $banner->description,
                'image_url' => $banner->getFirstMediaUrl('images'),
                'link_url' => $banner->link_url,
                'order' => $banner->order,
            ],
        ]);
    }
}
