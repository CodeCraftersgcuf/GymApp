# Error Handling Standards

This document defines error handling patterns, exception management, and logging standards for the GYM App backend.

## 🎯 Principles

1. **Consistent Error Responses**: All API errors follow the same structure
2. **Proper HTTP Status Codes**: Use appropriate status codes for different error types
3. **Meaningful Error Messages**: Provide clear, actionable error messages
4. **Error Logging**: Log errors appropriately for debugging and monitoring
5. **Security**: Don't expose sensitive information in error responses

## 📋 Standard Error Response Format

### Success Response
```json
{
    "data": {
        // Resource data
    },
    "message": "Optional success message"
}
```

### Error Response
```json
{
    "error": "Error type/code",
    "message": "Human-readable error message",
    "errors": {
        // Validation errors (only for 422)
        "field_name": ["Error message 1", "Error message 2"]
    }
}
```

## 🔢 HTTP Status Codes

| Status Code | Usage | Example |
|-------------|-------|---------|
| `200` | Success (GET, PUT, PATCH) | Resource retrieved/updated successfully |
| `201` | Created | Resource created successfully |
| `204` | No Content | Resource deleted successfully |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `422` | Validation Error | Input validation failed |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error (logged) |

## 🛠️ Error Handling Patterns

### 1. Controller-Level Error Handling

**Pattern**: Use try-catch blocks for operations that might fail.

```php
<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function show($id): JsonResponse
    {
        try {
            $order = Order::with(['user', 'product'])->findOrFail($id);
            
            // Check authorization
            if ($order->user_id !== auth()->id() && !auth()->user()->hasRole('Admin')) {
                return response()->json([
                    'error' => 'forbidden',
                    'message' => 'You do not have permission to view this order.',
                ], 403);
            }

            return response()->json([
                'data' => $order,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'Order not found.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve order', [
                'order_id' => $id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'internal_error',
                'message' => 'An error occurred while retrieving the order.',
            ], 500);
        }
    }
}
```

### 2. Validation Error Handling

**Pattern**: Use Form Requests for validation. Laravel automatically returns 422 with validation errors.

```php
<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'provider' => 'sometimes|in:stripe,jazzcash,easypaisa',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Product ID is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'provider.in' => 'Invalid payment provider.',
        ];
    }

    // Optional: Customize validation error response format
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'error' => 'validation_failed',
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
```

### 3. Model Not Found Handling

**Pattern**: Use `findOrFail()` and catch `ModelNotFoundException`.

```php
use Illuminate\Database\Eloquent\ModelNotFoundException;

try {
    $user = User::findOrFail($id);
} catch (ModelNotFoundException $e) {
    return response()->json([
        'error' => 'not_found',
        'message' => 'User not found.',
    ], 404);
}
```

### 4. Authorization Error Handling

**Pattern**: Use Policies or manual checks, return 403 for forbidden access.

```php
// Using Policy
public function update(Request $request, Order $order)
{
    $this->authorize('update', $order);
    // ... update logic
}

// Manual check
if (!$user->hasRole('Admin') && $order->user_id !== $user->id) {
    return response()->json([
        'error' => 'forbidden',
        'message' => 'You do not have permission to update this order.',
    ], 403);
}
```

### 5. Business Logic Error Handling

**Pattern**: Throw custom exceptions or return error responses for business rule violations.

```php
public function store(CreateOrderRequest $request): JsonResponse
{
    $product = Product::findOrFail($request->product_id);

    // Business rule: Product must be active
    if (!$product->active) {
        return response()->json([
            'error' => 'product_unavailable',
            'message' => 'This product is currently unavailable.',
        ], 400);
    }

    // Business rule: User must have sufficient balance (example)
    if (auth()->user()->balance < $product->price_cents) {
        return response()->json([
            'error' => 'insufficient_balance',
            'message' => 'You do not have sufficient balance to purchase this product.',
        ], 400);
    }

    // ... create order
}
```

### 6. External Service Error Handling

**Pattern**: Catch exceptions from external services, log them, return user-friendly errors.

```php
use App\Services\Payments\PaymentProviderInterface;
use Illuminate\Support\Facades\Log;

public function processPayment(Order $order): JsonResponse
{
    try {
        $checkout = $this->paymentService->createCheckout($order);
        
        return response()->json([
            'data' => [
                'checkout_url' => $checkout['checkout_url'],
            ],
        ]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
        Log::error('Stripe API error', [
            'order_id' => $order->id,
            'error' => $e->getMessage(),
            'stripe_error' => $e->getJsonBody(),
        ]);

        return response()->json([
            'error' => 'payment_failed',
            'message' => 'Unable to process payment. Please try again.',
        ], 500);
    } catch (\Exception $e) {
        Log::error('Payment processing failed', [
            'order_id' => $order->id,
            'error' => $e->getMessage(),
        ]);

        return response()->json([
            'error' => 'payment_error',
            'message' => 'An error occurred while processing your payment.',
        ], 500);
    }
}
```

## 📝 Logging Standards

### When to Log

1. **Always Log**:
   - 500 errors (internal server errors)
   - External API failures
   - Security-related events (failed auth attempts)
   - Critical business logic failures

2. **Conditionally Log**:
   - 404 errors (only if unexpected)
   - 403 errors (for security monitoring)
   - Business rule violations (for analytics)

3. **Never Log**:
   - Validation errors (expected user input errors)
   - Normal 401 errors (expected for unauthenticated requests)

### Logging Format

```php
use Illuminate\Support\Facades\Log;

// Error with context
Log::error('Operation failed', [
    'user_id' => auth()->id(),
    'resource_id' => $resource->id,
    'error' => $e->getMessage(),
    'trace' => $e->getTraceAsString(), // Only for 500 errors
]);

// Warning for recoverable issues
Log::warning('Payment verification failed', [
    'order_id' => $order->id,
    'signature' => substr($signature, 0, 10) . '...', // Don't log full sensitive data
]);

// Info for important events
Log::info('Order created', [
    'order_id' => $order->id,
    'user_id' => $order->user_id,
    'amount' => $order->amount_cents,
]);
```

### Log Levels

- **`Log::error()`**: Errors that need attention
- **`Log::warning()`**: Warnings that might need attention
- **`Log::info()`**: Important events for auditing
- **`Log::debug()`**: Debug information (only in development)

## 🚫 What NOT to Do

### ❌ Don't Expose Sensitive Information

```php
// BAD: Exposes database structure
catch (\Exception $e) {
    return response()->json([
        'error' => $e->getMessage(), // Might contain sensitive info
        'trace' => $e->getTraceAsString(), // Never expose in production
    ], 500);
}

// GOOD: Generic error message
catch (\Exception $e) {
    Log::error('Operation failed', ['error' => $e->getMessage()]);
    return response()->json([
        'error' => 'internal_error',
        'message' => 'An error occurred. Please try again later.',
    ], 500);
}
```

### ❌ Don't Return Different Error Formats

```php
// BAD: Inconsistent formats
return ['error' => 'Something went wrong'];
return response()->json(['message' => 'Error occurred']);
return ['status' => 'error', 'msg' => 'Failed'];

// GOOD: Consistent format
return response()->json([
    'error' => 'error_code',
    'message' => 'Human-readable message',
], 400);
```

### ❌ Don't Swallow Exceptions

```php
// BAD: Hides errors
try {
    $this->dangerousOperation();
} catch (\Exception $e) {
    // Silent failure - no logging, no response
    return null;
}

// GOOD: Handle and log
try {
    $this->dangerousOperation();
} catch (\Exception $e) {
    Log::error('Operation failed', ['error' => $e->getMessage()]);
    return response()->json([
        'error' => 'operation_failed',
        'message' => 'The operation could not be completed.',
    ], 500);
}
```

## 🔧 Global Exception Handler

Laravel's exception handler is configured in `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions) {
    // Ensure API routes return JSON error responses
    $exceptions->shouldRenderJsonWhen(function ($request, \Throwable $e) {
        if ($request->is('api/*')) {
            return true;
        }
        return $request->expectsJson();
    });
})
```

## 📚 Common Error Scenarios

### Scenario 1: Resource Not Found
```php
try {
    $resource = Model::findOrFail($id);
} catch (ModelNotFoundException $e) {
    return response()->json([
        'error' => 'not_found',
        'message' => 'Resource not found.',
    ], 404);
}
```

### Scenario 2: Validation Failed
```php
// Automatically handled by Form Request
// Returns 422 with validation errors
```

### Scenario 3: Unauthorized Access
```php
if (!auth()->check()) {
    return response()->json([
        'error' => 'unauthorized',
        'message' => 'Authentication required.',
    ], 401);
}
```

### Scenario 4: Forbidden Access
```php
if (!$user->can('update', $resource)) {
    return response()->json([
        'error' => 'forbidden',
        'message' => 'You do not have permission to perform this action.',
    ], 403);
}
```

### Scenario 5: Rate Limiting
```php
// Handled by Laravel's throttle middleware
// Returns 429 automatically
```

## ✅ Error Handling Checklist

When implementing error handling:

- [ ] Use appropriate HTTP status codes
- [ ] Return consistent error response format
- [ ] Provide meaningful error messages
- [ ] Log errors appropriately (especially 500 errors)
- [ ] Don't expose sensitive information
- [ ] Handle ModelNotFoundException
- [ ] Handle ValidationException (via Form Requests)
- [ ] Handle authorization errors (403)
- [ ] Handle external service errors
- [ ] Use try-catch for operations that might fail
- [ ] Test error scenarios

---

**Related Documentation**:
- [API Standards](./api-standards.md)
- [Structure](./structure.md)
- [Authentication](./authentication.md)

