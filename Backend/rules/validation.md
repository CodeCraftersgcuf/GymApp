# Validation Standards

This document defines validation patterns, form request usage, and input validation standards for the GYM App backend.

## 🎯 Validation Principles

1. **Always Validate Input**: Never trust user input
2. **Use Form Requests**: For complex validation logic
3. **Clear Error Messages**: Provide meaningful validation messages
4. **Consistent Rules**: Reuse validation rules when possible
5. **Client & Server Validation**: Validate on both sides

## 📋 Validation Methods

### 1. Form Requests (Recommended)

**When to Use**: Complex validation, reusable validation logic, custom messages

**Location**: `app/Http/Requests/Api/V1/`

**Naming**: `{Action}{Resource}Request.php` (e.g., `RegisterRequest.php`, `UpdateProfileRequest.php`)

**Example**:
```php
<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public endpoint
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'gender' => 'required|in:male,female,other',
            'weight_kg' => 'nullable|numeric|min:0|max:500',
            'city' => 'nullable|string|max:255',
            'locale' => 'sometimes|string|in:en,ar,ur',
            'timezone' => 'sometimes|string|max:255',
            'profile_picture' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'gender.required' => 'Gender is required.',
            'gender.in' => 'Gender must be one of: male, female, other.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'weight_kg' => 'weight',
            'profile_picture' => 'profile picture',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
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

**Usage in Controller**:
```php
public function register(RegisterRequest $request)
{
    // Validation already passed, use validated data
    $validated = $request->validated();
    
    // Or access specific fields
    $name = $request->name;
    $email = $request->email;
}
```

### 2. Inline Validation (Simple Cases)

**When to Use**: Simple validation, one-off validation rules

**Example**:
```php
public function updatePassword(Request $request)
{
    $validated = $request->validate([
        'current_password' => 'required|string',
        'password' => 'required|string|min:8|confirmed',
    ]);

    // Use validated data
}
```

### 3. Manual Validation

**When to Use**: Complex conditional validation, custom validation logic

**Example**:
```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($request->all(), [
    'email' => 'required|email',
    'password' => 'required|min:8',
]);

if ($validator->fails()) {
    return response()->json([
        'error' => 'validation_failed',
        'errors' => $validator->errors(),
    ], 422);
}
```

## 📝 Common Validation Rules

### String Validation
```php
'name' => 'required|string|max:255',
'description' => 'nullable|string|max:1000',
```

### Email Validation
```php
'email' => 'required|email|unique:users,email',
'email' => 'required|email|unique:users,email,' . $userId, // Exclude current user
```

### Password Validation
```php
'password' => 'required|string|min:8|confirmed',
'password' => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/', // Strong password
```

### Numeric Validation
```php
'price' => 'required|numeric|min:0',
'quantity' => 'required|integer|min:1',
'weight_kg' => 'nullable|numeric|min:0|max:500',
```

### Date Validation
```php
'dob' => 'required|date|before:today',
'start_date' => 'required|date|after:today',
'end_date' => 'required|date|after:start_date',
```

### File Validation
```php
'profile_picture' => 'required|image|mimes:jpeg,png,jpg|max:2048',
'document' => 'required|file|mimes:pdf,doc,docx|max:5120',
```

### Enum/In Validation
```php
'status' => 'required|in:pending,approved,rejected',
'gender' => 'required|in:male,female,other',
'level' => 'required|in:beginner,intermediate,advanced',
```

### Exists Validation
```php
'user_id' => 'required|exists:users,id',
'product_id' => 'required|exists:products,id',
'category_id' => 'nullable|exists:categories,id',
```

### Array Validation
```php
'tags' => 'required|array',
'tags.*' => 'required|string|max:50',
'items' => 'required|array|min:1',
'items.*.id' => 'required|exists:items,id',
'items.*.quantity' => 'required|integer|min:1',
```

### Conditional Validation
```php
use Illuminate\Validation\Rule;

'email' => [
    'required',
    'email',
    Rule::unique('users')->ignore($this->user->id),
],

'status' => [
    'required',
    Rule::in(['pending', 'approved', 'rejected']),
],

// Conditional rules
'password' => Rule::requiredIf($request->has('change_password')),
'old_password' => 'required_with:password',
```

## 🔄 Update Validation Patterns

### Excluding Current Record

```php
// In UpdateRequest
public function rules(): array
{
    $userId = $this->route('id'); // or $this->user->id

    return [
        'email' => [
            'required',
            'email',
            Rule::unique('users')->ignore($userId),
        ],
        'name' => 'required|string|max:255',
    ];
}
```

### Partial Updates

```php
public function rules(): array
{
    return [
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $this->user->id,
        'phone' => 'sometimes|nullable|string|max:20',
    ];
}
```

**Note**: Use `sometimes` for optional fields in update requests.

## 🎨 Custom Validation Rules

### Creating Custom Rules

```php
php artisan make:rule StrongPassword
```

**Example Custom Rule**:
```php
<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class StrongPassword implements Rule
{
    public function passes($attribute, $value)
    {
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/', $value);
    }

    public function message()
    {
        return 'The :attribute must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
}
```

**Usage**:
```php
use App\Rules\StrongPassword;

'password' => ['required', 'string', 'min:8', new StrongPassword()],
```

## 📋 Validation Best Practices

### 1. Always Validate on Server

Even if client validates, always validate on server.

### 2. Use Form Requests for Complex Validation

```php
// BAD: Inline validation for complex rules
public function store(Request $request)
{
    $request->validate([
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])/',
        // ... many more rules
    ]);
}

// GOOD: Use Form Request
public function store(RegisterRequest $request)
{
    // Validation handled in Form Request
}
```

### 3. Provide Clear Error Messages

```php
public function messages(): array
{
    return [
        'email.required' => 'Email address is required.',
        'email.email' => 'Please provide a valid email address.',
        'email.unique' => 'This email is already registered. Please use a different email.',
    ];
}
```

### 4. Use Appropriate Validation Rules

```php
// BAD: Too permissive
'email' => 'required',

// GOOD: Specific validation
'email' => 'required|email|unique:users,email',
```

### 5. Validate File Uploads Properly

```php
'image' => 'required|image|mimes:jpeg,png,jpg|max:2048', // 2MB max
'document' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
```

### 6. Validate Relationships

```php
// Always check if related record exists
'user_id' => 'required|exists:users,id',
'product_id' => 'required|exists:products,id',
```

### 7. Sanitize Input When Needed

```php
// In Form Request
protected function prepareForValidation()
{
    $this->merge([
        'email' => strtolower(trim($this->email)),
        'name' => trim($this->name),
    ]);
}
```

## 🚫 Common Validation Mistakes

### ❌ Not Validating Required Fields

```php
// BAD: No validation
public function store(Request $request)
{
    $user = User::create($request->all());
}

// GOOD: Always validate
public function store(CreateUserRequest $request)
{
    $user = User::create($request->validated());
}
```

### ❌ Weak Password Validation

```php
// BAD: Weak validation
'password' => 'required|min:6',

// GOOD: Strong validation
'password' => 'required|string|min:8|confirmed',
```

### ❌ Not Checking Uniqueness on Updates

```php
// BAD: Allows duplicate emails on update
'email' => 'required|email|unique:users,email',

// GOOD: Exclude current record
'email' => [
    'required',
    'email',
    Rule::unique('users')->ignore($userId),
],
```

### ❌ Not Validating File Types

```php
// BAD: Accepts any file
'file' => 'required|file',

// GOOD: Specific file types
'file' => 'required|image|mimes:jpeg,png,jpg|max:2048',
```

## ✅ Validation Checklist

When implementing validation:

- [ ] Use Form Requests for complex validation
- [ ] Provide clear error messages
- [ ] Validate all required fields
- [ ] Use appropriate validation rules
- [ ] Check uniqueness (especially for emails)
- [ ] Validate file uploads (type, size)
- [ ] Validate relationships (exists)
- [ ] Handle partial updates (use `sometimes`)
- [ ] Exclude current record in updates
- [ ] Sanitize input when needed
- [ ] Test validation scenarios

---

**Related Documentation**:
- [Error Handling](./error-handling.md)
- [API Standards](./api-standards.md)
- [Structure](./structure.md)

