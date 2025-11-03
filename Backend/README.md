# Fitness App Backend

Production-ready Laravel 11 backend for a fitness application similar to PakFit, featuring mobile API (v1), admin panel (Filament v4), authentication (Sanctum), role-based access control, media uploads, payments (Stripe), and comprehensive logging.

## Features

- ✅ **Mobile API (v1)** for Expo React Native (TypeScript) app
- ✅ **Admin Panel** using Filament v4
- ✅ **Authentication** via Laravel Sanctum (personal access tokens)
- ✅ **Role-based Access Control** via Spatie Laravel Permission (Admin, Coach, User)
- ✅ **Media Uploads** via Spatie Media Library
- ✅ **Queues** (database driver), cache, pagination, rate limiting
- ✅ **Payments** abstraction + Stripe webhooks (extensible to local gateways)
- ✅ **OpenAPI 3 spec** and Postman collection

## Requirements

- PHP ≥ 8.2
- MySQL 8.0+ / PostgreSQL / SQLite
- Composer
- Node.js & NPM (for assets)

## Installation

1. **Clone and install dependencies:**
```bash
composer install
```

2. **Configure environment:**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Update `.env` with your database credentials:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fitness
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=database
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. **Run migrations and seeders:**
```bash
php artisan migrate
php artisan db:seed
```

5. **Create storage link:**
```bash
php artisan storage:link
```

6. **Publish package configs:**
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="medialibrary-migrations"
php artisan vendor:publish --tag="filament-config"
```

7. **Install Filament Admin Panel:**
```bash
php artisan filament:install --panels
```

8. **Run queue worker (in separate terminal):**
```bash
php artisan queue:work
```

## Default Credentials

After seeding:
- **Admin:** admin@fitness.app / password
- **Coach 1:** coach1@fitness.app / password
- **Coach 2:** coach2@fitness.app / password

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

### Public Endpoints
- `GET /api/v1/health` - Health check
- `GET /api/v1/config` - App configuration
- `GET /api/v1/programs` - List public programs (filters: ?goal=fat_loss&level=beginner)
- `GET /api/v1/programs/{id}` - Get program details
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login

### Authenticated Endpoints (Bearer Token)
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/me` - Update profile
- `PUT /api/v1/auth/password` - Update password
- `POST /api/v1/auth/logout` - Logout

#### User Programs
- `GET /api/v1/user-programs` - My programs
- `POST /api/v1/user-programs` - Subscribe to program
- `GET /api/v1/user-programs/{id}` - Program details

#### Workout Logs
- `GET /api/v1/workout-logs?from=YYYY-MM-DD&to=YYYY-MM-DD` - List logs
- `POST /api/v1/workout-logs` - Create log
- `GET /api/v1/workout-logs/{id}` - Get log

#### Nutrition
- `GET /api/v1/nutrition-logs?from=YYYY-MM-DD&to=YYYY-MM-DD` - List logs
- `POST /api/v1/nutrition-logs` - Create log

#### Progress
- `GET /api/v1/progress-logs?from=YYYY-MM-DD&to=YYYY-MM-DD` - List logs
- `POST /api/v1/progress-logs` - Create log

#### Check-ins
- `GET /api/v1/check-ins` - List check-ins
- `POST /api/v1/check-ins` - Request check-in

#### Payments
- `GET /api/v1/products` - Available products
- `POST /api/v1/orders` - Create order (initiates payment)

### Coach Endpoints (Coach/Admin role required)
- `GET /api/v1/coach/clients` - List clients
- `GET /api/v1/coach/clients/{userId}/overview` - Client overview
- `POST /api/v1/coach/programs` - Create program
- `POST /api/v1/coach/meal-plans` - Create meal plan
- `POST /api/v1/coach/check-ins/{id}/complete` - Complete check-in

### Webhooks
- `POST /api/v1/webhooks/stripe` - Stripe webhook handler

## Authentication

The API uses Laravel Sanctum personal access tokens. Include the token in the `Authorization` header:

```
Authorization: Bearer {token}
```

## Database Schema

### Core Entities
- **Users** - Extended with fitness fields (height, weight, goal, etc.)
- **Roles & Permissions** - Spatie Permission (Admin, Coach, User)
- **Coaches** - Coach profiles with certifications
- **Programs** - Workout programs (public/private)
- **Phases** - Program phases
- **Workouts** - Individual workouts
- **Exercises** - Exercise library with media
- **User Programs** - User subscriptions to programs
- **Workout Logs** - User workout tracking
- **Set Logs** - Individual set tracking
- **Foods** - Food database
- **Meal Plans** - Nutrition plans
- **Meals** - Meal plans meals
- **Meal Items** - Meal items
- **Nutrition Logs** - Daily nutrition tracking
- **Progress Logs** - Body measurements tracking
- **Check-ins** - Coach-user check-ins
- **Products** - Payment products
- **Orders** - Payment orders
- **Subscriptions** - Active subscriptions
- **Audit Logs** - System audit trail

## Filament Admin Panel

Access the admin panel at `/admin` after installation.

### Setup Admin Access:
1. Create admin user (or use seeded admin)
2. Assign 'Admin' role
3. Login at `/admin/login`

The admin panel includes resources for all entities with CRUD operations, filters, search, and widgets.

## Stripe Webhook Setup

1. Get webhook secret from Stripe Dashboard
2. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`
3. Configure webhook URL in Stripe: `https://yourdomain.com/api/v1/webhooks/stripe`
4. Enable events: `checkout.session.completed`, `customer.subscription.*`

## Testing

Run tests with:
```bash
php artisan test
```

Feature tests cover:
- Authentication (register/login)
- User program subscription
- Workout log creation
- Nutrition log creation
- Payment webhook handling

## Code Style

This project uses Laravel Pint for code formatting:
```bash
./vendor/bin/pint
```

## Queue Workers

Process jobs:
```bash
php artisan queue:work
```

Or use supervisor for production.

## Caching

Public data (programs, foods) is cached. Clear cache:
```bash
php artisan cache:clear
```

## Documentation

- **OpenAPI Spec:** See `docs/openapi.yaml`
- **Postman Collection:** See `docs/postman/FitnessApp.postman_collection.json`
- **Postman Environment:** See `docs/postman/Local.postman_environment.json`

## Project Structure

```
app/
  Http/
    Controllers/Api/V1/     # API controllers
    Requests/Api/V1/         # Form requests
    Resources/Api/V1/       # API resources
  Models/                   # Eloquent models
  Policies/                  # Authorization policies
  Services/Payments/         # Payment service abstraction
  Observers/                 # Model observers (audit)
database/
  factories/                 # Model factories
  migrations/                # Database migrations
  seeders/                   # Database seeders
docs/
  openapi.yaml               # OpenAPI 3 specification
  postman/                   # Postman collection & environment
routes/
  api.php                    # API routes
```

## Security

- CSRF protection for web routes
- Sanctum token authentication for API
- Rate limiting on auth/payment endpoints
- Input validation via Form Requests
- Authorization via Policies
- Audit logging via Observers

## License

MIT
