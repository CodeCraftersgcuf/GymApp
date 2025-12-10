# API Standards & Response Formats

This document defines API response formats, endpoint conventions, and API design standards for the GYM App backend.

## 🎯 API Design Principles

1. **RESTful Design**: Follow REST conventions
2. **Consistent Responses**: All endpoints return consistent response structures
3. **Versioning**: Use URL versioning (`/api/v1/`)
4. **Pagination**: List endpoints always paginated
5. **Resource Transformers**: Use Resource classes for consistent data formatting

## 📋 Response Format Standards

### Success Response Structure

#### Single Resource
```json
{
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

#### Collection (Paginated)
```json
{
    "data": [
        {
            "id": 1,
            "name": "John Doe"
        },
        {
            "id": 2,
            "name": "Jane Doe"
        }
    ],
    "meta": {
        "current_page": 1,
        "per_page": 15,
        "total": 100,
        "last_page": 7
    },
    "links": {
        "first": "http://api.example.com/api/v1/users?page=1",
        "last": "http://api.example.com/api/v1/users?page=7",
        "prev": null,
        "next": "http://api.example.com/api/v1/users?page=2"
    }
}
```

#### Collection (Simple Array)
```json
{
    "data": [
        {
            "id": 1,
            "name": "Item 1"
        },
        {
            "id": 2,
            "name": "Item 2"
        }
    ]
}
```

#### Created Resource (201)
```json
{
    "data": {
        "id": 1,
        "name": "New Resource"
    },
    "message": "Resource created successfully"
}
```

#### Updated Resource (200)
```json
{
    "data": {
        "id": 1,
        "name": "Updated Resource"
    },
    "message": "Resource updated successfully"
}
```

#### Deleted Resource (204)
```
No content body
```

### Error Response Structure

See [Error Handling](./error-handling.md) for detailed error response formats.

## 🔗 Endpoint Conventions

### RESTful Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `GET` | `/api/v1/{resource}` | List resources | Sometimes |
| `GET` | `/api/v1/{resource}/{id}` | Show resource | Sometimes |
| `POST` | `/api/v1/{resource}` | Create resource | Yes |
| `PUT` | `/api/v1/{resource}/{id}` | Update resource | Yes |
| `PATCH` | `/api/v1/{resource}/{id}` | Partial update | Yes |
| `DELETE` | `/api/v1/{resource}/{id}` | Delete resource | Yes |

### Custom Endpoints

For actions that don't fit REST conventions:

| Pattern | Example | Purpose |
|---------|---------|---------|
| `POST /api/v1/{resource}/{id}/{action}` | `POST /api/v1/notifications/1/read` | Perform action |
| `GET /api/v1/{resource}/{action}` | `GET /api/v1/notifications/unread-count` | Get computed value |

## 📝 Controller Implementation Patterns

### 1. List Endpoint (Index)

```php
public function index(Request $request)
{
    $query = Model::query();

    // Apply filters
    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    // Apply sorting
    $sortBy = $request->get('sort_by', 'created_at');
    $sortOrder = $request->get('sort_order', 'desc');
    $query->orderBy($sortBy, $sortOrder);

    // Eager load relationships
    $query->with(['relationship1', 'relationship2']);

    // Paginate
    $items = $query->paginate($request->get('per_page', 15));

    // Return resource collection
    return ModelResource::collection($items);
}
```

### 2. Show Endpoint

```php
public function show($id)
{
    $item = Model::with(['relationship1', 'relationship2'])
        ->findOrFail($id);

    // Check authorization if needed
    $this->authorize('view', $item);

    return new ModelResource($item);
}
```

### 3. Store Endpoint

```php
public function store(CreateModelRequest $request)
{
    $validated = $request->validated();

    $item = Model::create([
        ...$validated,
        'user_id' => auth()->id(), // Set authenticated user
    ]);

    // Load relationships for response
    $item->load(['relationship1', 'relationship2']);

    return new ModelResource($item);
}
```

### 4. Update Endpoint

```php
public function update(UpdateModelRequest $request, $id)
{
    $item = Model::findOrFail($id);

    // Check authorization
    $this->authorize('update', $item);

    $validated = $request->validated();
    $item->update($validated);

    // Load relationships for response
    $item->load(['relationship1', 'relationship2']);

    return new ModelResource($item);
}
```

### 5. Destroy Endpoint

```php
public function destroy($id)
{
    $item = Model::findOrFail($id);

    // Check authorization
    $this->authorize('delete', $item);

    $item->delete();

    return response()->noContent();
}
```

## 🔍 Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 15, max: 100)

### Filtering
- Use query parameters for filters: `?status=active&type=premium`
- Document available filters in API documentation

### Sorting
- `sort_by`: Field to sort by (default: `created_at`)
- `sort_order`: `asc` or `desc` (default: `desc`)

### Includes (Eager Loading)
- `include`: Comma-separated relationships: `?include=user,product`

**Example**:
```
GET /api/v1/orders?page=1&per_page=20&status=pending&sort_by=created_at&sort_order=desc&include=user,product
```

## 📦 Resource Classes

### Purpose
Resource classes transform models into consistent API responses.

### Location
`app/Http/Resources/Api/V1/`

### Naming
`{Model}Resource.php` (e.g., `UserResource.php`)

### Implementation

```php
<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'profile_picture' => $this->getFirstMediaUrl('profile_pictures'),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            
            // Conditional fields
            'email_verified_at' => $this->when(
                $this->email_verified_at,
                $this->email_verified_at->toIso8601String()
            ),
            
            // Relationships (when loaded)
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name');
            }),
        ];
    }
}
```

### Best Practices

1. **Always format dates**: Use ISO 8601 format
2. **Handle null values**: Use `when()` for optional fields
3. **Include relationships conditionally**: Use `whenLoaded()`
4. **Transform media URLs**: Use `getFirstMediaUrl()` for media
5. **Don't expose sensitive data**: Never include passwords, tokens, etc.

## 🔐 Authentication

### Token-Based Auth (Sanctum)

**Request Header**:
```
Authorization: Bearer {token}
```

**Response on Success**:
```json
{
    "data": {
        "id": 1,
        "name": "John Doe"
    },
    "token": "1|abcdef123456..."
}
```

**Response on Failure (401)**:
```json
{
    "error": "unauthorized",
    "message": "Authentication required."
}
```

## 📊 Response Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Invalid request |
| `401` | Unauthorized | Not authenticated |
| `403` | Forbidden | Not authorized |
| `404` | Not Found | Resource not found |
| `422` | Validation Error | Validation failed |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |

## 🎨 Date/Time Formatting

**Standard**: ISO 8601 format

```php
// In Resource class
'created_at' => $this->created_at->toIso8601String(),
// Output: "2025-12-10T07:00:00+00:00"

// For date-only fields
'dob' => $this->dob?->format('Y-m-d'),
// Output: "1990-01-15"
```

## 🔄 Versioning

**Current Version**: `v1`

**URL Pattern**: `/api/v1/{resource}`

**Future Versions**: `/api/v2/{resource}`

When creating new endpoints:
- Always use `/api/v1/` prefix
- Keep backward compatibility when possible
- Document breaking changes

## 📋 API Documentation

### Required Documentation

1. **Endpoint Description**: What the endpoint does
2. **HTTP Method & URL**: Method and full URL
3. **Authentication**: Required or optional
4. **Request Parameters**: Query params, body params
5. **Response Format**: Success and error responses
6. **Example Requests**: cURL or code examples

### Documentation Tools

- OpenAPI/Swagger: `docs/openapi.yaml`
- Postman Collection: `docs/postman/`

## ✅ API Standards Checklist

When creating new API endpoints:

- [ ] Use RESTful conventions
- [ ] Return consistent response format
- [ ] Use Resource classes for responses
- [ ] Implement pagination for list endpoints
- [ ] Use appropriate HTTP status codes
- [ ] Include proper error handling
- [ ] Use Form Requests for validation
- [ ] Eager load relationships
- [ ] Format dates consistently (ISO 8601)
- [ ] Document the endpoint
- [ ] Test all scenarios (success, errors)

## 🚫 Common Mistakes to Avoid

### ❌ Inconsistent Response Formats

```php
// BAD: Different formats
return ['user' => $user];
return response()->json($user);
return new UserResource($user); // Only sometimes

// GOOD: Always use Resource
return new UserResource($user);
```

### ❌ Not Using Resources

```php
// BAD: Direct model serialization
return response()->json($user);

// GOOD: Use Resource class
return new UserResource($user);
```

### ❌ Missing Pagination

```php
// BAD: No pagination
return UserResource::collection(User::all());

// GOOD: Always paginate
return UserResource::collection(User::paginate(15));
```

### ❌ N+1 Query Problems

```php
// BAD: N+1 queries
$users = User::all();
// Accessing $user->orders in Resource causes N+1

// GOOD: Eager load
$users = User::with('orders')->paginate(15);
```

---

**Related Documentation**:
- [Error Handling](./error-handling.md)
- [Structure](./structure.md)
- [Validation](./validation.md)
- [Database](./database.md)

