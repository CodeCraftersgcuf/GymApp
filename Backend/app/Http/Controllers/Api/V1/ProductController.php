<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * List available products.
     */
    public function index(Request $request)
    {
        $query = Product::where('active', true);

        $products = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'slug' => $product->slug,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price_cents' => $product->price_cents,
                    'interval' => $product->interval,
                    'features' => $product->features,
                ];
            }),
            'meta' => [
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
            'links' => [
                'first' => $products->url(1),
                'last' => $products->url($products->lastPage()),
                'prev' => $products->previousPageUrl(),
                'next' => $products->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show a single product/package with details.
     */
    public function show($id)
    {
        $product = Product::where('active', true)->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'description' => $product->description,
                'price_cents' => $product->price_cents,
                'interval' => $product->interval,
                'features' => $product->features,
            ],
        ]);
    }
}
