<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
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
        $query = Product::query();

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $products = $query->latest()->paginate(15)->withQueryString();
        return view('admin.products.index', compact('products'));
    }

    public function create()
    {
        return view('admin.products.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:products',
            'name' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price_cents' => 'required|integer|min:0',
            'interval' => 'required|in:one_time,monthly,quarterly,semiannual,annual',
            'active' => 'sometimes|boolean',
            'features' => 'sometimes|nullable|array',
        ]);

        Product::create($validated);
        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        return view('admin.products.edit', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:products,slug,' . $product->id,
            'name' => 'required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price_cents' => 'required|integer|min:0',
            'interval' => 'required|in:one_time,monthly,quarterly,semiannual,annual',
            'active' => 'sometimes|boolean',
            'features' => 'sometimes|nullable|array',
        ]);

        $product->update($validated);
        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
