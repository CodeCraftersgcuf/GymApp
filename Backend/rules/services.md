# Services Layer Standards

This document defines service layer patterns, dependency injection, and business logic organization for the GYM App backend.

## 🎯 Purpose of Services

Services encapsulate business logic that:
- Doesn't belong in controllers (too complex)
- Doesn't belong in models (not database-related)
- Needs to be reusable across multiple controllers
- Integrates with external APIs
- Handles complex business rules

## 📁 Service Organization

### Directory Structure

```
app/Services/
├── Payments/
│   ├── PaymentProviderInterface.php
│   ├── StripePaymentService.php
│   └── JazzCashPaymentService.php
├── Notifications/
│   ├── NotificationService.php
│   └── EmailService.php
└── Analytics/
    └── AnalyticsService.php
```

### Naming Conventions

- **Services**: `{Purpose}Service.php` (e.g., `PaymentService.php`)
- **Interfaces**: `{Purpose}Interface.php` (e.g., `PaymentProviderInterface.php`)
- **Namespaces**: `App\Services\{Domain}\`

## 🏗️ Service Patterns

### 1. Interface-Based Services

**Use Case**: Multiple implementations, dependency injection, testing

**Example**:
```php
<?php

namespace App\Services\Payments;

interface PaymentProviderInterface
{
    public function createCheckout(Order $order): array;
    public function verifyWebhook(array $payload, string $signature): bool;
    public function handleWebhook(array $payload): void;
    public function refund(Order $order, int $amountCents): bool;
}

class StripePaymentService implements PaymentProviderInterface
{
    private $stripe;

    public function __construct()
    {
        $this->stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
    }

    public function createCheckout(Order $order): array
    {
        try {
            $session = $this->stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => strtolower($order->currency),
                        'product_data' => [
                            'name' => $order->product->name,
                        ],
                        'unit_amount' => $order->amount_cents,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => config('app.frontend_url') . '/payment/success',
                'cancel_url' => config('app.frontend_url') . '/payment/cancel',
                'metadata' => [
                    'order_id' => $order->id,
                ],
            ]);

            return [
                'checkout_url' => $session->url,
                'client_secret' => $session->client_secret,
                'session_id' => $session->id,
            ];
        } catch (\Exception $e) {
            \Log::error('Stripe checkout creation failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            throw new \Exception('Failed to create checkout session');
        }
    }

    public function verifyWebhook(array $payload, string $signature): bool
    {
        try {
            $event = \Stripe\Webhook::constructEvent(
                json_encode($payload),
                $signature,
                config('services.stripe.webhook_secret')
            );
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function handleWebhook(array $payload): void
    {
        $event = $payload['type'];
        $data = $payload['data']['object'];

        switch ($event) {
            case 'checkout.session.completed':
                $this->handleCheckoutCompleted($data);
                break;
            case 'payment_intent.succeeded':
                $this->handlePaymentSucceeded($data);
                break;
            // Handle other events
        }
    }

    private function handleCheckoutCompleted(array $data): void
    {
        $orderId = $data['metadata']['order_id'] ?? null;
        if ($orderId) {
            $order = \App\Models\Order::find($orderId);
            if ($order) {
                $order->update(['status' => 'completed']);
            }
        }
    }

    private function handlePaymentSucceeded(array $data): void
    {
        // Handle payment success
    }

    public function refund(Order $order, int $amountCents): bool
    {
        try {
            $refund = $this->stripe->refunds->create([
                'payment_intent' => $order->payment_intent_id,
                'amount' => $amountCents,
            ]);

            return $refund->status === 'succeeded';
        } catch (\Exception $e) {
            \Log::error('Refund failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}
```

### 2. Simple Service Classes

**Use Case**: Business logic that doesn't need multiple implementations

**Example**:
```php
<?php

namespace App\Services;

use App\Models\User;
use App\Models\Program;
use Illuminate\Support\Facades\DB;

class ProgramEnrollmentService
{
    /**
     * Enroll user in a program.
     */
    public function enrollUser(User $user, Program $program): void
    {
        DB::transaction(function () use ($user, $program) {
            // Check if user is already enrolled
            if ($user->programs()->where('program_id', $program->id)->exists()) {
                throw new \Exception('User is already enrolled in this program');
            }

            // Check if program is available
            if (!$program->is_public && !$user->hasRole('Admin')) {
                throw new \Exception('Program is not available');
            }

            // Enroll user
            $user->programs()->attach($program->id, [
                'enrolled_at' => now(),
                'status' => 'active',
            ]);

            // Create initial workout logs
            $this->createInitialWorkoutLogs($user, $program);

            // Send notification
            $user->notify(new \App\Notifications\ProgramEnrolled($program));
        });
    }

    /**
     * Create initial workout logs for program phases.
     */
    private function createInitialWorkoutLogs(User $user, Program $program): void
    {
        foreach ($program->phases as $phase) {
            foreach ($phase->workouts as $workout) {
                \App\Models\WorkoutLog::create([
                    'user_id' => $user->id,
                    'workout_id' => $workout->id,
                    'status' => 'pending',
                ]);
            }
        }
    }
}
```

### 3. Service with Repository Pattern

**Use Case**: Complex data operations, abstraction layer

**Example**:
```php
<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Repositories\OrderRepository;

class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private OrderRepository $orderRepository
    ) {}

    public function getUserWithOrders(int $userId): User
    {
        $user = $this->userRepository->find($userId);
        $user->orders = $this->orderRepository->getByUserId($userId);
        return $user;
    }
}
```

## 🔌 Dependency Injection

### Constructor Injection (Recommended)

```php
<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\Payments\PaymentProviderInterface;
use App\Services\ProgramEnrollmentService;

class OrderController extends Controller
{
    public function __construct(
        private PaymentProviderInterface $paymentService,
        private ProgramEnrollmentService $enrollmentService
    ) {}

    public function store(CreateOrderRequest $request)
    {
        // Use injected services
        $checkout = $this->paymentService->createCheckout($order);
    }
}
```

### Service Provider Binding

**Location**: `app/Providers/AppServiceProvider.php`

```php
<?php

namespace App\Providers;

use App\Services\Payments\PaymentProviderInterface;
use App\Services\Payments\StripePaymentService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind interface to implementation
        $this->app->bind(
            PaymentProviderInterface::class,
            StripePaymentService::class
        );
    }
}
```

### Method Injection

```php
public function processPayment(
    Request $request,
    PaymentProviderInterface $paymentService
) {
    // Service injected via method
}
```

## 📝 Service Best Practices

### 1. Single Responsibility

Each service should have one clear purpose.

```php
// BAD: Too many responsibilities
class UserService
{
    public function createUser() {}
    public function sendEmail() {}
    public function processPayment() {}
    public function generateReport() {}
}

// GOOD: Focused service
class UserService
{
    public function createUser() {}
    public function updateUser() {}
    public function deleteUser() {}
}
```

### 2. Use Transactions for Complex Operations

```php
use Illuminate\Support\Facades\DB;

public function enrollUser(User $user, Program $program): void
{
    DB::transaction(function () use ($user, $program) {
        // Multiple database operations
        $user->programs()->attach($program->id);
        $this->createWorkoutLogs($user, $program);
        $this->sendNotification($user, $program);
    });
}
```

### 3. Handle Exceptions Appropriately

```php
public function createCheckout(Order $order): array
{
    try {
        // External API call
        return $this->stripe->checkout->sessions->create([...]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
        \Log::error('Stripe API error', [
            'order_id' => $order->id,
            'error' => $e->getMessage(),
        ]);
        throw new \Exception('Payment processing failed');
    }
}
```

### 4. Return Meaningful Results

```php
// BAD: Returns void, success unclear
public function processOrder(Order $order): void
{
    // Process order
}

// GOOD: Returns result
public function processOrder(Order $order): bool
{
    try {
        // Process order
        return true;
    } catch (\Exception $e) {
        \Log::error('Order processing failed', ['error' => $e->getMessage()]);
        return false;
    }
}
```

### 5. Keep Services Testable

```php
// Use dependency injection
// Avoid static methods
// Make methods small and focused
```

## 🧪 Testing Services

### Unit Testing Services

```php
<?php

namespace Tests\Unit\Services;

use App\Services\Payments\StripePaymentService;
use Tests\TestCase;
use Mockery;

class StripePaymentServiceTest extends TestCase
{
    public function test_create_checkout_returns_url()
    {
        $service = new StripePaymentService();
        $order = \App\Models\Order::factory()->create();
        
        $result = $service->createCheckout($order);
        
        $this->assertArrayHasKey('checkout_url', $result);
        $this->assertArrayHasKey('client_secret', $result);
    }
}
```

## 📋 When to Create a Service

Create a service when:

- ✅ Business logic is complex (multiple steps)
- ✅ Logic needs to be reused across controllers
- ✅ Integrating with external APIs
- ✅ Processing payments or financial transactions
- ✅ Sending emails/notifications
- ✅ Complex data transformations
- ✅ Business rules that don't fit in models

Don't create a service for:

- ❌ Simple CRUD operations (use controllers)
- ❌ Database queries (use models/repositories)
- ❌ Simple validation (use form requests)
- ❌ Data transformation for API (use resources)

## ✅ Service Checklist

When creating a service:

- [ ] Define clear purpose and responsibility
- [ ] Use interfaces for multiple implementations
- [ ] Use dependency injection
- [ ] Handle exceptions appropriately
- [ ] Use transactions for complex operations
- [ ] Log important operations
- [ ] Write unit tests
- [ ] Document public methods
- [ ] Keep methods focused and small
- [ ] Return meaningful results

---

**Related Documentation**:
- [Structure](./structure.md)
- [Error Handling](./error-handling.md)
- [Database](./database.md)

