<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\Payments\PaymentProviderInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(
        private PaymentProviderInterface $paymentService
    ) {}

    /**
     * Create a new order and initiate payment.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'provider' => 'sometimes|in:stripe,jazzcash,easypaisa|default:stripe',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if (!$product->active) {
            return response()->json(['error' => 'Product is not available'], 400);
        }

        $order = Order::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'amount_cents' => $product->price_cents,
            'currency' => 'USD',
            'status' => 'pending',
            'provider' => $validated['provider'] ?? 'stripe',
        ]);

        try {
            $checkout = $this->paymentService->createCheckout($order);

            return response()->json([
                'data' => [
                    'order_id' => $order->id,
                    'checkout_url' => $checkout['checkout_url'],
                    'client_secret' => $checkout['client_secret'],
                ],
            ], 201);
        } catch (\Exception $e) {
            $order->update(['status' => 'failed']);
            return response()->json(['error' => 'Payment initiation failed'], 500);
        }
    }
}
