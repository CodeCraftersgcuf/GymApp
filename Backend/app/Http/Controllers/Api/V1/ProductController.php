<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\ProductResource;
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

        return ProductResource::collection($products);
    }

    /**
     * Show a single product/package with details.
     */
    public function show($id)
    {
        $product = Product::where('active', true)->findOrFail($id);

        return new ProductResource($product);
    }
}
