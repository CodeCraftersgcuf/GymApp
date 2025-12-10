# Database Standards

This document defines database query patterns, optimization strategies, and N+1 prevention for the GYM App backend.

## 🎯 Database Principles

1. **Eager Loading**: Always eager load relationships used in responses
2. **Query Optimization**: Minimize database queries
3. **N+1 Prevention**: Avoid N+1 query problems
4. **Index Usage**: Use indexes for frequently queried columns
5. **Transaction Safety**: Use transactions for multi-step operations

## 🔍 Eager Loading

### Problem: N+1 Queries

**Bad Example**:
```php
// This causes N+1 queries
$users = User::all();

foreach ($users as $user) {
    echo $user->orders->count(); // N queries for N users
}
```

**Good Example**:
```php
// Eager load relationships
$users = User::with('orders')->get();

foreach ($users as $user) {
    echo $user->orders->count(); // No additional queries
}
```

### Eager Loading Patterns

#### 1. Basic Eager Loading

```php
// Single relationship
$users = User::with('orders')->get();

// Multiple relationships
$users = User::with(['orders', 'profile', 'subscriptions'])->get();

// Nested relationships
$programs = Program::with(['coach', 'phases.workouts.exercises'])->get();
```

#### 2. Conditional Eager Loading

```php
// Eager load based on condition
$users = User::with(['orders' => function ($query) {
    $query->where('status', 'completed');
}])->get();
```

#### 3. Eager Loading Specific Columns

```php
// Load only needed columns
$users = User::with(['coach:id,name,email'])->get();

// Important: Always include foreign key
$users = User::with(['coach:id,name,email'])->get(); // Good
$users = User::with(['coach:name,email'])->get(); // BAD - missing id
```

#### 4. Lazy Eager Loading

```php
// Load relationships after the fact
$users = User::all();
$users->load('orders');
```

### Eager Loading in Controllers

```php
public function index(Request $request)
{
    $query = User::with(['orders', 'subscriptions']);

    // Apply filters
    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    $users = $query->paginate(15);

    return UserResource::collection($users);
}
```

## 📊 Query Optimization

### 1. Select Only Needed Columns

```php
// BAD: Selects all columns
$users = User::all();

// GOOD: Select only needed columns
$users = User::select('id', 'name', 'email')->get();
```

### 2. Use Indexes

**Migration Example**:
```php
Schema::table('orders', function (Blueprint $table) {
    $table->index('user_id'); // Index for foreign key
    $table->index('status'); // Index for frequently filtered column
    $table->index(['user_id', 'status']); // Composite index
});
```

### 3. Avoid SELECT * in Raw Queries

```php
// BAD
DB::table('users')->get();

// GOOD
DB::table('users')->select('id', 'name', 'email')->get();
```

### 4. Use Chunking for Large Datasets

```php
// Process large datasets in chunks
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // Process user
    }
});
```

### 5. Use Pagination

```php
// Always paginate list endpoints
$users = User::paginate(15); // Default 15 per page
$users = User::paginate($request->get('per_page', 15));
```

## 🔗 Relationship Patterns

### 1. BelongsTo Relationships

```php
// In Model
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

// Usage with eager loading
$orders = Order::with('user:id,name,email')->get();
```

### 2. HasMany Relationships

```php
// In Model
public function orders(): HasMany
{
    return $this->hasMany(Order::class);
}

// Usage with eager loading
$users = User::with('orders')->get();
```

### 3. Many-to-Many Relationships

```php
// In Model
public function programs(): BelongsToMany
{
    return $this->belongsToMany(Program::class, 'user_programs')
        ->withPivot('enrolled_at', 'status')
        ->withTimestamps();
}

// Usage with eager loading
$users = User::with('programs')->get();
```

### 4. HasOne Relationships

```php
// In Model
public function profile(): HasOne
{
    return $this->hasOne(Profile::class);
}

// Usage with eager loading
$users = User::with('profile')->get();
```

## 🚫 Common Database Mistakes

### ❌ N+1 Query Problem

```php
// BAD: N+1 queries
$users = User::all();
foreach ($users as $user) {
    echo $user->orders->count();
}

// GOOD: Eager load
$users = User::with('orders')->get();
foreach ($users as $user) {
    echo $user->orders->count();
}
```

### ❌ Loading Unnecessary Relationships

```php
// BAD: Loading relationships not used
$users = User::with(['orders', 'subscriptions', 'profile', 'settings'])->get();
// But only using orders in response

// GOOD: Load only what's needed
$users = User::with('orders')->get();
```

### ❌ Not Using Indexes

```php
// BAD: Querying without index
$orders = Order::where('status', 'pending')->get();

// GOOD: Add index to status column
// In migration:
$table->index('status');
```

### ❌ Selecting All Columns

```php
// BAD: Selecting all columns
$users = User::all();

// GOOD: Select only needed
$users = User::select('id', 'name', 'email')->get();
```

### ❌ Not Paginating Large Results

```php
// BAD: Loading all records
$users = User::all(); // Could be thousands

// GOOD: Paginate
$users = User::paginate(15);
```

## 🔄 Transaction Patterns

### 1. Database Transactions

```php
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    $user = User::create([...]);
    $order = Order::create([...]);
    $subscription = Subscription::create([...]);
    
    // If any operation fails, all are rolled back
});
```

### 2. Manual Transaction Control

```php
DB::beginTransaction();

try {
    $user = User::create([...]);
    $order = Order::create([...]);
    
    DB::commit();
} catch (\Exception $e) {
    DB::rollBack();
    throw $e;
}
```

## 📝 Query Scopes

### Defining Scopes

```php
// In Model
public function scopeActive($query)
{
    return $query->where('status', 'active');
}

public function scopePremium($query)
{
    return $query->where('user_type', 'premium');
}

// Usage
$users = User::active()->premium()->get();
```

### Dynamic Scopes

```php
public function scopeStatus($query, $status)
{
    return $query->where('status', $status);
}

// Usage
$users = User::status('active')->get();
```

## 🔍 Query Debugging

### Enable Query Logging

```php
// In development
DB::enableQueryLog();

// Your queries
$users = User::with('orders')->get();

// Check queries
dd(DB::getQueryLog());
```

### Laravel Debugbar

Install Laravel Debugbar to see all queries in development:
```bash
composer require barryvdh/laravel-debugbar --dev
```

## 📋 Database Checklist

When writing database queries:

- [ ] Eager load all relationships used in response
- [ ] Select only needed columns
- [ ] Use indexes for frequently queried columns
- [ ] Paginate list queries
- [ ] Use transactions for multi-step operations
- [ ] Avoid N+1 query problems
- [ ] Use query scopes for reusable filters
- [ ] Test query performance
- [ ] Monitor query count in development

## 🎯 Performance Tips

### 1. Use Eager Loading

Always eager load relationships:
```php
$users = User::with('orders')->get(); // Good
```

### 2. Use Indexes

Add indexes for:
- Foreign keys
- Frequently filtered columns
- Frequently sorted columns

### 3. Limit Results

```php
// Use pagination
$users = User::paginate(15);

// Or limit
$users = User::limit(100)->get();
```

### 4. Use Caching

```php
// Cache expensive queries
$users = Cache::remember('active_users', 3600, function () {
    return User::active()->get();
});
```

### 5. Avoid COUNT(*) on Large Tables

```php
// BAD: Slow on large tables
$count = User::count();

// GOOD: Use approximate count or cache
$count = Cache::remember('user_count', 3600, function () {
    return User::count();
});
```

---

**Related Documentation**:
- [Structure](./structure.md)
- [API Standards](./api-standards.md)
- [Services](./services.md)

