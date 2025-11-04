<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'gender' => 'required|in:male,female,other',
            'weight_kg' => 'required|numeric|min:20|max:500',
            'city' => 'required|string|max:255',
            'locale' => 'sometimes|string|max:10',
            'timezone' => 'sometimes|string|max:50',
        ];
    }
}
