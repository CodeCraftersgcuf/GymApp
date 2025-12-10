<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\PackageResource;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PackageController extends Controller
{
    /**
     * List all active packages/payment options.
     */
    public function index(Request $request)
    {
        $packages = Package::where('is_active', true)
            ->orderBy('order')
            ->orderBy('id')
            ->get();

        return PackageResource::collection($packages);
    }

    /**
     * Show a single package with details.
     */
    public function show($id): JsonResponse
    {
        $package = Package::where('is_active', true)->findOrFail($id);

        return response()->json([
            'data' => new PackageResource($package),
        ]);
    }
}
