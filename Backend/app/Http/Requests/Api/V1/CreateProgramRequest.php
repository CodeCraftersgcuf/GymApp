<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateProgramRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only coaches and admins can create programs
        return auth()->user()->hasRole('Coach') || auth()->user()->hasRole('Admin');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'goal' => 'required|in:fat_loss,muscle_gain,maintenance,endurance,strength',
            'level' => 'required|in:beginner,intermediate,advanced',
            'duration_weeks' => 'required|integer|min:1|max:104',
            'is_public' => 'sometimes|boolean',
            'price_cents' => 'sometimes|nullable|integer|min:0',
            'description' => 'sometimes|nullable|string|max:5000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Program title is required.',
            'title.max' => 'Program title cannot exceed 255 characters.',
            'goal.required' => 'Program goal is required.',
            'goal.in' => 'Program goal must be one of: fat_loss, muscle_gain, maintenance, endurance, strength.',
            'level.required' => 'Program level is required.',
            'level.in' => 'Program level must be one of: beginner, intermediate, advanced.',
            'duration_weeks.required' => 'Program duration is required.',
            'duration_weeks.integer' => 'Program duration must be an integer.',
            'duration_weeks.min' => 'Program duration must be at least 1 week.',
            'duration_weeks.max' => 'Program duration cannot exceed 104 weeks (2 years).',
            'price_cents.integer' => 'Price must be an integer.',
            'price_cents.min' => 'Price cannot be negative.',
            'description.max' => 'Description cannot exceed 5000 characters.',
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

