<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateProgressLogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'logged_at' => 'required|date',
            'weight_kg' => 'nullable|numeric|min:0|max:500',
            'body_fat_percent' => 'nullable|numeric|min:0|max:100',
            'chest_cm' => 'nullable|numeric|min:0|max:200',
            'waist_cm' => 'nullable|numeric|min:0|max:200',
            'hips_cm' => 'nullable|numeric|min:0|max:200',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'logged_at.required' => 'Logged date is required.',
            'logged_at.date' => 'Logged date must be a valid date.',
            'weight_kg.numeric' => 'Weight must be a number.',
            'weight_kg.min' => 'Weight cannot be negative.',
            'weight_kg.max' => 'Weight cannot exceed 500kg.',
            'body_fat_percent.numeric' => 'Body fat percentage must be a number.',
            'body_fat_percent.min' => 'Body fat percentage cannot be negative.',
            'body_fat_percent.max' => 'Body fat percentage cannot exceed 100%.',
            'chest_cm.numeric' => 'Chest measurement must be a number.',
            'chest_cm.min' => 'Chest measurement cannot be negative.',
            'chest_cm.max' => 'Chest measurement cannot exceed 200cm.',
            'waist_cm.numeric' => 'Waist measurement must be a number.',
            'waist_cm.min' => 'Waist measurement cannot be negative.',
            'waist_cm.max' => 'Waist measurement cannot exceed 200cm.',
            'hips_cm.numeric' => 'Hips measurement must be a number.',
            'hips_cm.min' => 'Hips measurement cannot be negative.',
            'hips_cm.max' => 'Hips measurement cannot exceed 200cm.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
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

