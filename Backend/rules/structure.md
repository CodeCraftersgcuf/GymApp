# Backend Structure & Organization

This document outlines the folder structure, naming conventions, and organization patterns for the GYM App backend.

## 📁 Directory Structure

```
Backend/
├── app/
│   ├── Filament/              # Admin panel resources (Filament)
│   │   ├── Resources/         # Filament resources for admin CRUD
│   │   └── Widgets/           # Admin dashboard widgets
│   ├── Http/
│   │   ├── Controllers/       # All controllers
│   │   │   ├── Admin/         # Admin panel controllers
│   │   │   └── Api/
│   │   │       └── V1/        # API v1 controllers
│   │   ├── Middleware/        # Custom middleware
│   │   ├── Requests/          # Form request validation classes
│   │   │   └── Api/V1/        # API v1 form requests
│   │   └── Resources/         # API resource transformers
│   │       └── Api/V1/        # API v1 resources
│   ├── Models/                # Eloquent models
│   ├── Observers/             # Model observers
│   ├── Policies/              # Authorization policies
│   ├── Providers/             # Service providers
│   └── Services/              # Business logic services
│       └── Payments/          # Payment service implementations
├── bootstrap/                 # Application bootstrap
├── config/                    # Configuration files
├── database/
│   ├── factories/            # Model factories
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
├── public/                    # Public assets
├── resources/
│   ├── views/                # Blade templates (admin panel)
│   ├── css/                  # Stylesheets
│   └── js/                   # JavaScript
├── routes/
│   ├── api.php               # API routes
│   ├── web.php               # Web routes (admin)
│   └── console.php           # Artisan commands
├── storage/                   # Storage (logs, cache, files)
├── tests/                     # Test files
└── vendor/                    # Composer dependencies
```

## 🏗️ Architecture Layers

### 1. Controllers Layer (`app/Http/Controllers/`)

**Purpose**: Handle HTTP requests, validate input, call services, return responses.

**Organization**:
- `Admin/` - Admin panel controllers (web routes)
- `Api/V1/` - API v1 controllers (API routes)

**Naming Convention**:
- Controllers: `{Resource}Controller.php` (e.g., `UserController.php`)
- Methods: `index`, `show`, `store`, `update`, `destroy`

**Example Structure**:
```php
<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // List users
    }

    public function show($id)
    {
        // Show single user
    }
}
```

### 2. Models Layer (`app/Models/`)

**Purpose**: Eloquent models representing database tables.

**Naming Convention**:
- Models: Singular, PascalCase (e.g., `User.php`, `WorkoutLog.php`)
- Table names: Plural, snake_case (e.g., `users`, `workout_logs`)

**Best Practices**:
- Define relationships in models
- Use fillable/guarded for mass assignment protection
- Add accessors/mutators when needed
- Use scopes for reusable query logic

**Example**:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutLog extends Model
{
    protected $fillable = [
        'user_id',
        'workout_id',
        'completed_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function workout(): BelongsTo
    {
        return $this->belongsTo(Workout::class);
    }
}
```

### 3. Services Layer (`app/Services/`)

**Purpose**: Business logic that doesn't belong in controllers or models.

**When to Use**:
- Complex business logic
- External API integrations
- Payment processing
- Data transformation
- Reusable business operations

**Naming Convention**:
- Services: `{Purpose}Service.php` (e.g., `PaymentService.php`)
- Interfaces: `{Purpose}Interface.php` (e.g., `PaymentProviderInterface.php`)

**Example**:
```php
<?php

namespace App\Services\Payments;

interface PaymentProviderInterface
{
    public function createCheckout(Order $order): array;
    public function verifyWebhook(array $payload, string $signature): bool;
}

class StripePaymentService implements PaymentProviderInterface
{
    // Implementation
}
```

### 4. Resources Layer (`app/Http/Resources/`)

**Purpose**: Transform models into API responses.

**Organization**:
- `Api/V1/` - API v1 resource classes

**Naming Convention**:
- Resources: `{Model}Resource.php` (e.g., `UserResource.php`)

**Example**:
```php
<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            // ... other fields
        ];
    }
}
```

### 5. Requests Layer (`app/Http/Requests/`)

**Purpose**: Form request validation classes.

**Naming Convention**:
- Requests: `{Action}{Resource}Request.php` (e.g., `RegisterRequest.php`, `UpdateProfileRequest.php`)

**Example**:
```php
<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }
}
```

## 📝 Naming Conventions

### Files & Classes
- **Controllers**: `{Resource}Controller.php` → `UserController`
- **Models**: `{Model}.php` → `User.php`
- **Services**: `{Purpose}Service.php` → `PaymentService.php`
- **Resources**: `{Model}Resource.php` → `UserResource.php`
- **Requests**: `{Action}{Resource}Request.php` → `RegisterRequest.php`
- **Policies**: `{Model}Policy.php` → `UserPolicy.php`
- **Observers**: `{Model}Observer.php` → `UserObserver.php`

### Methods
- **CRUD**: `index`, `show`, `store`, `update`, `destroy`
- **Custom**: Use descriptive verbs (e.g., `markAsRead`, `completeCheckIn`)

### Variables
- **camelCase** for variables and methods
- **PascalCase** for classes
- **UPPER_SNAKE_CASE** for constants

### Database
- **Tables**: Plural, snake_case (e.g., `workout_logs`)
- **Columns**: snake_case (e.g., `user_id`, `created_at`)
- **Foreign Keys**: `{table}_id` (e.g., `user_id`, `workout_id`)

## 🔗 Route Organization

### API Routes (`routes/api.php`)

**Structure**:
```php
// Public routes
Route::prefix('v1')->group(function () {
    Route::get('/health', [HealthController::class, 'index']);
    // ... public endpoints
});

// Authenticated routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // ... authenticated endpoints
});

// Role-based routes
Route::prefix('v1')->middleware(['auth:sanctum', 'role:Coach|Admin'])->group(function () {
    // ... coach/admin endpoints
});
```

**URL Patterns**:
- List: `GET /api/v1/{resource}` (e.g., `/api/v1/users`)
- Show: `GET /api/v1/{resource}/{id}` (e.g., `/api/v1/users/1`)
- Create: `POST /api/v1/{resource}` (e.g., `/api/v1/users`)
- Update: `PUT /api/v1/{resource}/{id}` (e.g., `/api/v1/users/1`)
- Delete: `DELETE /api/v1/{resource}/{id}` (e.g., `/api/v1/users/1`)

## 📦 Code Organization Rules

### 1. Single Responsibility Principle
- Controllers: Handle HTTP requests/responses only
- Models: Database interactions and relationships
- Services: Business logic
- Resources: Data transformation

### 2. Dependency Injection
- Use constructor injection for services
- Use method injection for form requests

### 3. Namespace Organization
- Follow PSR-4 autoloading
- Match directory structure
- Use versioning for API (`Api\V1\`)

### 4. File Size Guidelines
- Controllers: Keep methods focused, max ~100 lines per method
- Models: Keep relationships and scopes organized
- Services: One service per business domain

## 🔍 Quick Reference

| Component | Location | Example |
|-----------|----------|---------|
| API Controller | `app/Http/Controllers/Api/V1/` | `UserController.php` |
| Admin Controller | `app/Http/Controllers/Admin/` | `UserController.php` |
| Model | `app/Models/` | `User.php` |
| Service | `app/Services/` | `PaymentService.php` |
| Resource | `app/Http/Resources/Api/V1/` | `UserResource.php` |
| Form Request | `app/Http/Requests/Api/V1/` | `RegisterRequest.php` |
| Policy | `app/Policies/` | `UserPolicy.php` |
| Observer | `app/Observers/` | `UserObserver.php` |
| Middleware | `app/Http/Middleware/` | `EnsureUserIsPremium.php` |

---

**Related Documentation**:
- [Error Handling](./error-handling.md)
- [API Standards](./api-standards.md)
- [Services](./services.md)

