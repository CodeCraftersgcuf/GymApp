# Phase 1 Implementation Plan - Critical Controllers

**Status**: In Progress  
**Priority**: P0 (Blocking)  
**Estimated Time**: 2-3 weeks (80 hours)  
**Last Updated**: December 10, 2025

## Overview

Phase 1 focuses on implementing 6 critical API controllers that are currently empty stubs, blocking core fitness tracking functionality. This phase includes creating form requests, API resources, and implementing all controller methods following established patterns.

## Objectives

1. ✅ Implement 6 empty API controllers (17 methods total)
2. ✅ Create 10+ form request validation classes
3. ✅ Create 8+ API resource classes
4. ✅ Follow established code patterns and standards
5. ✅ Ensure proper error handling and validation
6. ✅ Implement proper authorization checks

---

## Implementation Breakdown

### 1. CheckInController (3 methods)

#### 1.1 `index()` - List User's Check-ins
**Route**: `GET /api/v1/check-ins`  
**Auth**: Required (auth:sanctum)  
**Purpose**: List authenticated user's check-ins with coach information

**Requirements**:
- Filter by status (pending, completed, cancelled)
- Filter by date range
- Pagination support
- Eager load coach relationship
- Return CheckInResource collection

**Validation**: None (query parameters only)

**Response**: Paginated collection of CheckInResource

#### 1.2 `store()` - Request New Check-in
**Route**: `POST /api/v1/check-ins`  
**Auth**: Required (auth:sanctum)  
**Purpose**: User requests a check-in with their assigned coach

**Requirements**:
- Validate coach assignment (user must have coach)
- Validate scheduled_at is in future
- Prevent duplicate check-ins on same date
- Set status to 'pending'
- Return CheckInResource

**Validation**: CreateCheckInRequest
- `coach_id`: required|exists:users,id
- `scheduled_at`: required|date|after:today
- `notes`: nullable|string|max:1000

**Response**: CheckInResource (201)

#### 1.3 `complete()` - Coach Completes Check-in
**Route**: `POST /api/v1/check-ins/{id}/complete`  
**Auth**: Required (auth:sanctum, role:Coach|Admin)  
**Purpose**: Coach marks check-in as completed

**Requirements**:
- Verify coach owns the check-in
- Update status to 'completed'
- Set completed_at timestamp
- Allow notes update
- Return CheckInResource

**Validation**: CompleteCheckInRequest
- `notes`: nullable|string|max:1000

**Response**: CheckInResource (200)

---

### 2. CoachController (3 methods)

#### 2.1 `clients()` - List Coach's Clients
**Route**: `GET /api/v1/coach/clients`  
**Auth**: Required (auth:sanctum, role:Coach|Admin)  
**Purpose**: List all clients assigned to the coach

**Requirements**:
- Filter by active/inactive programs
- Pagination support
- Eager load user programs and basic stats
- Return ClientResource collection

**Validation**: None (query parameters only)

**Response**: Paginated collection of ClientResource

#### 2.2 `clientOverview()` - Get Client's Full Overview
**Route**: `GET /api/v1/coach/clients/{userId}/overview`  
**Auth**: Required (auth:sanctum, role:Coach|Admin)  
**Purpose**: Get comprehensive overview of a client's progress

**Requirements**:
- Verify coach-client relationship
- Include user profile
- Include active programs
- Include recent workout logs (last 30 days)
- Include recent nutrition logs (last 30 days)
- Include recent progress logs (last 30 days)
- Include statistics (total workouts, avg calories, etc.)
- Return ClientOverviewResource

**Validation**: None (route parameter only)

**Response**: ClientOverviewResource

#### 2.3 `createMealPlan()` - Create Meal Plan for Client
**Route**: `POST /api/v1/coach/meal-plans`  
**Auth**: Required (auth:sanctum, role:Coach|Admin)  
**Purpose**: Coach creates a custom meal plan for a client

**Requirements**:
- Verify coach-client relationship
- Create meal plan with meals and meal items
- Validate all foods exist
- Calculate total macros
- Set coach_id and user_id
- Return MealPlanResource

**Validation**: CreateMealPlanRequest
- `user_id`: required|exists:users,id
- `title`: required|string|max:255
- `kcal_target`: required|integer|min:0
- `protein_target_g`: required|numeric|min:0
- `carbs_target_g`: required|numeric|min:0
- `fats_target_g`: required|numeric|min:0
- `description`: nullable|string
- `meals`: required|array|min:1
- `meals.*.title`: required|string|max:255
- `meals.*.meal_type`: required|in:breakfast,lunch,dinner,snack
- `meals.*.order`: required|integer|min:0
- `meals.*.items`: required|array|min:1
- `meals.*.items.*.food_id`: required|exists:foods,id
- `meals.*.items.*.servings`: required|numeric|min:0.1
- `meals.*.items.*.order`: required|integer|min:0

**Response**: MealPlanResource (201)

---

### 3. UserProgramController (3 methods)

#### 3.1 `index()` - List User's Programs
**Route**: `GET /api/v1/user-programs`  
**Auth**: Required (auth:sanctum)  
**Purpose**: List authenticated user's subscribed programs

**Requirements**:
- Filter by status (active, completed, cancelled)
- Pagination support
- Eager load program, coach relationships
- Return UserProgramResource collection

**Validation**: None (query parameters only)

**Response**: Paginated collection of UserProgramResource

#### 3.2 `store()` - Subscribe to Program
**Route**: `POST /api/v1/user-programs`  
**Auth**: Required (auth:sanctum)  
**Purpose**: User subscribes to a program

**Requirements**:
- Validate program exists and is available
- Check if user already subscribed
- Handle payment if program has price
- Assign coach if specified
- Calculate start_date and end_date
- Set status to 'active'
- Return UserProgramResource

**Validation**: SubscribeProgramRequest
- `program_id`: required|exists:programs,id
- `coach_id`: nullable|exists:users,id|exists:coaches,user_id

**Response**: UserProgramResource (201)

#### 3.3 `show()` - Get Program Details with Progress
**Route**: `GET /api/v1/user-programs/{id}`  
**Auth**: Required (auth:sanctum)  
**Purpose**: Get user program details with progress tracking

**Requirements**:
- Verify user owns the program subscription
- Include program details with phases/workouts
- Include progress statistics
- Include workout completion rate
- Return UserProgramResource

**Validation**: None (route parameter only)

**Response**: UserProgramResource

---

### 4. WorkoutLogController (3 methods)

#### 4.1 `index()` - List Workout Logs
**Route**: `GET /api/v1/workout-logs`  
**Auth**: Required (auth:sanctum)  
**Purpose**: List user's workout logs with filters

**Requirements**:
- Filter by date range (from, to)
- Filter by workout_id
- Pagination support
- Eager load workout, setLogs relationships
- Return WorkoutLogResource collection

**Validation**: None (query parameters only)

**Response**: Paginated collection of WorkoutLogResource

#### 4.2 `store()` - Create Workout Log
**Route**: `POST /api/v1/workout-logs`  
**Auth**: Required (auth:sanctum)  
**Purpose**: Log a completed workout with sets

**Requirements**:
- Validate workout exists
- Create workout log
- Create set logs in transaction
- Validate all exercises exist
- Calculate total volume
- Return WorkoutLogResource

**Validation**: CreateWorkoutLogRequest
- `workout_id`: required|exists:workouts,id
- `performed_at`: required|date
- `duration_minutes`: nullable|integer|min:1
- `notes`: nullable|string|max:1000
- `sets`: required|array|min:1
- `sets.*.exercise_id`: required|exists:exercises,id
- `sets.*.set_number`: required|integer|min:1
- `sets.*.weight_kg`: nullable|numeric|min:0
- `sets.*.reps`: required|integer|min:1
- `sets.*.rpe`: nullable|numeric|min:1|max:10
- `sets.*.notes`: nullable|string|max:500

**Response**: WorkoutLogResource (201)

#### 4.3 `show()` - Get Workout Log Details
**Route**: `GET /api/v1/workout-logs/{id}`  
**Auth**: Required (auth:sanctum)  
**Purpose**: Get detailed workout log with all sets

**Requirements**:
- Verify user owns the log
- Eager load workout, setLogs.exercise
- Return WorkoutLogResource

**Validation**: None (route parameter only)

**Response**: WorkoutLogResource

---

### 5. NutritionLogController (2 methods)

#### 5.1 `index()` - List Nutrition Logs
**Route**: `GET /api/v1/nutrition-logs`  
**Auth**: Required (auth:sanctum)  
**Purpose**: List user's nutrition logs with filters

**Requirements**:
- Filter by date range (from, to)
- Pagination support
- Calculate daily totals
- Return NutritionLogResource collection

**Validation**: None (query parameters only)

**Response**: Paginated collection of NutritionLogResource

#### 5.2 `store()` - Create Nutrition Log
**Route**: `POST /api/v1/nutrition-logs`  
**Auth**: Required (auth:sanctum)  
**Purpose**: Log daily nutrition intake

**Requirements**:
- Validate macro totals are reasonable
- Prevent duplicate logs for same date
- Calculate total calories from macros
- Return NutritionLogResource

**Validation**: CreateNutritionLogRequest
- `logged_at`: required|date
- `kcal`: required|integer|min:0|max:10000
- `protein_g`: required|numeric|min:0|max:500
- `carbs_g`: required|numeric|min:0|max:1000
- `fats_g`: required|numeric|min:0|max:500
- `water_ml`: nullable|integer|min:0|max:10000
- `notes`: nullable|string|max:1000

**Response**: NutritionLogResource (201)

---

### 6. ProgressLogController (2 methods)

#### 6.1 `index()` - List Progress Logs
**Route**: `GET /api/v1/progress-logs`  
**Auth**: Required (auth:sanctum)  
**Purpose**: List user's progress logs with filters

**Requirements**:
- Filter by date range (from, to)
- Pagination support
- Calculate changes from previous log
- Return ProgressLogResource collection

**Validation**: None (query parameters only)

**Response**: Paginated collection of ProgressLogResource

#### 6.2 `store()` - Create Progress Log
**Route**: `POST /api/v1/progress-logs`  
**Auth**: Required (auth:sanctum)  
**Purpose**: Log body measurements and progress

**Requirements**:
- Validate measurements are reasonable
- Prevent duplicate logs for same date
- Calculate changes from previous log
- Return ProgressLogResource

**Validation**: CreateProgressLogRequest
- `logged_at`: required|date
- `weight_kg`: nullable|numeric|min:0|max:500
- `body_fat_percent`: nullable|numeric|min:0|max:100
- `chest_cm`: nullable|numeric|min:0|max:200
- `waist_cm`: nullable|numeric|min:0|max:200
- `hips_cm`: nullable|numeric|min:0|max:200
- `notes`: nullable|string|max:1000

**Response**: ProgressLogResource (201)

---

## Form Requests to Create

1. **CreateCheckInRequest** - Check-in creation validation
2. **CompleteCheckInRequest** - Check-in completion validation
3. **CreateMealPlanRequest** - Meal plan creation validation
4. **SubscribeProgramRequest** - Program subscription validation
5. **CreateWorkoutLogRequest** - Workout log creation validation
6. **CreateNutritionLogRequest** - Nutrition log creation validation
7. **CreateProgressLogRequest** - Progress log creation validation

---

## API Resources to Create

1. **CheckInResource** - Check-in response format
2. **ClientResource** - Client list response format
3. **ClientOverviewResource** - Client overview response format
4. **MealPlanResource** - Meal plan response format
5. **MealResource** - Meal response format
6. **MealItemResource** - Meal item response format
7. **UserProgramResource** - User program response format
8. **SetLogResource** - Set log response format
9. **NutritionLogResource** - Nutrition log response format
10. **ProgressLogResource** - Progress log response format

**Update Existing**:
- **WorkoutLogResource** - Complete implementation

---

## Implementation Order

### Step 1: Create Form Requests (Foundation)
1. CreateCheckInRequest
2. CompleteCheckInRequest
3. SubscribeProgramRequest
4. CreateWorkoutLogRequest
5. CreateNutritionLogRequest
6. CreateProgressLogRequest
7. CreateMealPlanRequest

### Step 2: Create API Resources (Foundation)
1. CheckInResource
2. SetLogResource
3. Update WorkoutLogResource
4. NutritionLogResource
5. ProgressLogResource
6. UserProgramResource
7. MealItemResource
8. MealResource
9. MealPlanResource
10. ClientResource
11. ClientOverviewResource

### Step 3: Implement Controllers (Implementation)
1. ProgressLogController (simplest, 2 methods)
2. NutritionLogController (simple, 2 methods)
3. CheckInController (3 methods, moderate complexity)
4. WorkoutLogController (3 methods, moderate complexity)
5. UserProgramController (3 methods, business logic)
6. CoachController (3 methods, most complex)

---

## Code Patterns to Follow

### Controller Pattern
```php
public function index(Request $request)
{
    $query = Model::where('user_id', auth()->id())
        ->with(['relationship1', 'relationship2']);

    // Apply filters
    if ($request->has('filter')) {
        $query->where('field', $request->filter);
    }

    $items = $query->paginate($request->get('per_page', 15));

    return ResourceClass::collection($items);
}
```

### Store Pattern
```php
public function store(CreateRequest $request)
{
    $validated = $request->validated();

    DB::transaction(function () use ($validated) {
        $item = Model::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        // Create related records
    });

    return new ResourceClass($item->load('relationships'));
}
```

### Error Handling Pattern
```php
try {
    // Business logic
} catch (ModelNotFoundException $e) {
    return response()->json([
        'error' => 'not_found',
        'message' => 'Resource not found.',
    ], 404);
} catch (\Exception $e) {
    Log::error('Operation failed', ['error' => $e->getMessage()]);
    return response()->json([
        'error' => 'internal_error',
        'message' => 'An error occurred.',
    ], 500);
}
```

---

## Testing Checklist

After implementation, verify:

- [ ] All routes are accessible
- [ ] Authentication required where needed
- [ ] Authorization checks work (coach-only, user ownership)
- [ ] Validation works correctly
- [ ] Error handling works
- [ ] Pagination works
- [ ] Filtering works
- [ ] Eager loading prevents N+1 queries
- [ ] Resources return correct format
- [ ] Transactions work for multi-step operations

---

## Success Criteria

✅ All 6 controllers implemented  
✅ All 17 methods functional  
✅ All form requests created  
✅ All API resources created  
✅ All routes working  
✅ No N+1 query problems  
✅ Proper error handling  
✅ Consistent response formats  
✅ Authorization checks in place  

---

**Next Steps After Phase 1**:
- Phase 2: Authorization & Validation (Policies)
- Phase 3: API Resources & Responses (remaining resources)
- Phase 4: Filament Admin Panel
- Phase 5: Testing

