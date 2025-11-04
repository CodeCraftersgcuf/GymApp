<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\UpdateProfileRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'gender' => $request->gender,
            'weight_kg' => $request->weight_kg,
            'city' => $request->city,
            'user_type' => 'simple', // Default to simple user on registration
            'locale' => $request->locale ?? 'en',
            'timezone' => $request->timezone ?? 'UTC',
        ]);

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $user->addMediaFromRequest('profile_picture')
                ->toMediaCollection('profile_pictures');
        }

        // Assign default User role
        $user->assignRole('User');

        // Create token
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'data' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    /**
     * Login user.
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        // Create token
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'data' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get authenticated user.
     */
    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    /**
     * Update user profile.
     */
    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = $request->user();

        // Update user fields
        $updateData = $request->only([
            'name',
            'phone',
            'email',
            'gender',
            'dob',
            'height_cm',
            'weight_kg',
            'goal',
            'city',
            'locale',
            'timezone',
            'notification_token',
        ]);

        // Remove null values to allow partial updates
        $updateData = array_filter($updateData, function ($value) {
            return $value !== null;
        });

        $user->update($updateData);

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture
            $user->clearMediaCollection('profile_pictures');
            // Add new profile picture
            $user->addMediaFromRequest('profile_picture')
                ->toMediaCollection('profile_pictures');
        }

        return response()->json([
            'data' => new UserResource($user),
            'message' => 'Profile updated successfully',
        ]);
    }

    /**
     * Update password.
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['message' => 'Password updated successfully']);
    }
}
