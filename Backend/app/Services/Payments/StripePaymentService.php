<?php

namespace App\Services\Payments;

use App\Models\Order;
use App\Models\Subscription;
use Stripe\StripeClient;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use Illuminate\Support\Facades\Log;

/**
 * Stripe Payment Service Implementation
 */
class StripePaymentService implements PaymentProviderInterface
{
    private StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    public function createCheckout(Order $order): array
    {
        $product = $order->product;

        // For one-time payments
        if ($product->interval === 'one_time') {
            $session = $this->stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => strtolower($order->currency),
                        'product_data' => [
                            'name' => $product->name,
                            'description' => $product->description,
                        ],
                        'unit_amount' => $order->amount_cents,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => config('app.url') . '/api/v1/payments/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => config('app.url') . '/api/v1/payments/cancel',
                'metadata' => [
                    'order_id' => $order->id,
                ],
            ]);

            $order->update([
                'provider_ref' => $session->id,
                'meta' => array_merge($order->meta ?? [], ['stripe_session_id' => $session->id]),
            ]);

            return [
                'checkout_url' => $session->url,
                'client_secret' => null,
            ];
        }

        // For subscriptions
        $stripePrice = $this->stripe->prices->create([
            'currency' => strtolower($order->currency),
            'unit_amount' => $order->amount_cents,
            'recurring' => ['interval' => $this->mapInterval($product->interval)],
            'product_data' => [
                'name' => $product->name,
                'description' => $product->description,
            ],
        ]);

        $session = $this->stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $stripePrice->id,
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => config('app.url') . '/api/v1/payments/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => config('app.url') . '/api/v1/payments/cancel',
            'metadata' => [
                'order_id' => $order->id,
            ],
        ]);

        $order->update([
            'provider_ref' => $session->id,
            'meta' => array_merge($order->meta ?? [], ['stripe_session_id' => $session->id]),
        ]);

        return [
            'checkout_url' => $session->url,
            'client_secret' => null,
        ];
    }

    public function verifyWebhook(array $payload, string $signature): bool
    {
        try {
            Webhook::constructEvent(
                json_encode($payload),
                $signature,
                config('services.stripe.webhook_secret')
            );
            return true;
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe webhook signature verification failed', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function handleWebhook(array $payload): void
    {
        $event = $payload;
        $eventType = $event['type'] ?? null;

        match ($eventType) {
            'checkout.session.completed' => $this->handleCheckoutCompleted($event['data']['object']),
            'payment_intent.succeeded' => $this->handlePaymentSucceeded($event['data']['object']),
            'customer.subscription.created', 'customer.subscription.updated' => $this->handleSubscriptionEvent($event['data']['object']),
            'customer.subscription.deleted' => $this->handleSubscriptionCancelled($event['data']['object']),
            default => Log::info('Unhandled Stripe webhook event', ['type' => $eventType]),
        };
    }

    private function handleCheckoutCompleted(array $session): void
    {
        $orderId = $session['metadata']['order_id'] ?? null;
        if (!$orderId) {
            return;
        }

        $order = Order::find($orderId);
        if (!$order) {
            return;
        }

        $order->update([
            'status' => 'paid',
            'provider_ref' => $session['id'],
        ]);

        // Create subscription if recurring
        if ($session['mode'] === 'subscription' && isset($session['subscription'])) {
            $subscription = $this->stripe->subscriptions->retrieve($session['subscription']);
            $this->createOrUpdateSubscription($order, $subscription);
        }
    }

    private function handlePaymentSucceeded(array $paymentIntent): void
    {
        // Handle payment intent success
        Log::info('Payment intent succeeded', ['payment_intent' => $paymentIntent['id']]);
    }

    private function handleSubscriptionEvent(array $subscription): void
    {
        $order = Order::where('provider_ref', $subscription['id'])
            ->orWhere('meta->stripe_subscription_id', $subscription['id'])
            ->first();

        if ($order) {
            $this->createOrUpdateSubscription($order, $subscription);
        }
    }

    private function handleSubscriptionCancelled(array $subscription): void
    {
        Subscription::where('provider_ref', $subscription['id'])
            ->update(['status' => 'cancelled']);
    }

    private function createOrUpdateSubscription(Order $order, array $stripeSubscription): void
    {
        Subscription::updateOrCreate(
            ['provider_ref' => $stripeSubscription['id']],
            [
                'user_id' => $order->user_id,
                'product_id' => $order->product_id,
                'status' => $stripeSubscription['status'] === 'active' ? 'active' : 'inactive',
                'started_at' => now()->setTimestamp($stripeSubscription['created']),
                'ends_at' => isset($stripeSubscription['current_period_end'])
                    ? now()->setTimestamp($stripeSubscription['current_period_end'])
                    : null,
                'provider' => 'stripe',
                'meta' => $stripeSubscription,
            ]
        );
    }

    private function mapInterval(string $interval): string
    {
        return match ($interval) {
            'monthly' => 'month',
            'quarterly' => 'month', // Will need custom handling
            'semiannual' => 'month', // Will need custom handling
            'annual' => 'year',
            default => 'month',
        };
    }
}

