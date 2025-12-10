<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CreateOrderRequest;
use App\Http\Resources\Api\V1\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Services\Payments\PaymentProviderInterface;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(
        private PaymentProviderInterface $paymentService
    ) {}

    /**
     * Create a new order and initiate payment.
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $product = Product::findOrFail($validated['product_id']);

        if (!$product->active) {
            return response()->json([
                'error' => 'product_unavailable',
                'message' => 'Product is not available.',
            ], 400);
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
                    'order' => new OrderResource($order->load('product')),
                    'checkout_url' => $checkout['checkout_url'],
                    'client_secret' => $checkout['client_secret'],
                ],
                'message' => 'Order created successfully. Please complete payment.',
            ], 201);
        } catch (\Exception $e) {
            $order->update(['status' => 'failed']);
            \Log::error('Payment initiation failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'error' => 'payment_failed',
                'message' => 'Payment initiation failed. Please try again.',
            ], 500);
        }
    }
}
