<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // User can update their own profile
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->user()?->id ?? 0;

        return [
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|unique:users,phone,' . $userId,
            'email' => 'sometimes|email|unique:users,email,' . $userId,
            'gender' => 'sometimes|in:male,female,other',
            'dob' => 'sometimes|nullable|date',
            'height_cm' => 'sometimes|nullable|numeric|min:50|max:300',
            'weight_kg' => 'sometimes|nullable|numeric|min:20|max:500',
            'goal' => 'sometimes|in:fat_loss,muscle_gain,maintenance,endurance,strength',
            'city' => 'sometimes|nullable|string|max:255',
            'locale' => 'sometimes|string|max:10',
            'timezone' => 'sometimes|string|max:50',
            'notification_token' => 'sometimes|nullable|string',
            'profile_picture' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }
}
