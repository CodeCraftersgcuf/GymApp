<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\Payments\PaymentProviderInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function __construct(
        private PaymentProviderInterface $paymentService
    ) {}

    /**
     * Handle Stripe webhooks.
     */
    public function stripe(Request $request)
    {
        $payload = $request->all();
        $signature = $request->header('Stripe-Signature');

        if (!$signature) {
            return response()->json(['error' => 'Missing signature'], 400);
        }

        if (!$this->paymentService->verifyWebhook($payload, $signature)) {
            Log::warning('Stripe webhook verification failed');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        try {
            $this->paymentService->handleWebhook($payload);
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Webhook handling failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Processing failed'], 500);
        }
    }
}
