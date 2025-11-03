<?php

namespace App\Services\Payments;

use App\Models\Order;

/**
 * Payment Provider Interface
 * 
 * Abstraction layer for payment gateways (Stripe, JazzCash, Easypaisa, etc.)
 */
interface PaymentProviderInterface
{
    /**
     * Create a checkout session/payment intent for an order.
     *
     * @param Order $order
     * @return array ['checkout_url' => string, 'client_secret' => string|null]
     */
    public function createCheckout(Order $order): array;

    /**
     * Verify and handle webhook payload.
     *
     * @param array $payload
     * @param string $signature
     * @return bool
     */
    public function verifyWebhook(array $payload, string $signature): bool;

    /**
     * Process webhook event.
     *
     * @param array $payload
     * @return void
     */
    public function handleWebhook(array $payload): void;
}

