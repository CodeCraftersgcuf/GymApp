<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
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

        return response()->json([
            'data' => $packages->map(function ($package) {
                return [
                    'id' => $package->id,
                    'title' => $package->title,
                    'bank_name' => $package->bank_name,
                    'account_title' => $package->account_title,
                    'account_number' => $package->account_number,
                    'whatsapp_number' => $package->whatsapp_number,
                    'description' => $package->description,
                    'order' => $package->order,
                ];
            }),
        ]);
    }

    /**
     * Show a single package with details.
     */
    public function show($id): JsonResponse
    {
        $package = Package::where('is_active', true)->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $package->id,
                'title' => $package->title,
                'bank_name' => $package->bank_name,
                'account_title' => $package->account_title,
                'account_number' => $package->account_number,
                'whatsapp_number' => $package->whatsapp_number,
                'description' => $package->description,
                'order' => $package->order,
            ],
        ]);
    }
}
