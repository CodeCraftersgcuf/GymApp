<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateNutritionLogRequest extends FormRequest
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
            'kcal' => 'required|integer|min:0|max:10000',
            'protein_g' => 'required|numeric|min:0|max:500',
            'carbs_g' => 'required|numeric|min:0|max:1000',
            'fats_g' => 'required|numeric|min:0|max:500',
            'water_ml' => 'nullable|integer|min:0|max:10000',
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
            'kcal.required' => 'Calories are required.',
            'kcal.integer' => 'Calories must be an integer.',
            'kcal.min' => 'Calories cannot be negative.',
            'kcal.max' => 'Calories cannot exceed 10000.',
            'protein_g.required' => 'Protein is required.',
            'protein_g.numeric' => 'Protein must be a number.',
            'protein_g.min' => 'Protein cannot be negative.',
            'protein_g.max' => 'Protein cannot exceed 500g.',
            'carbs_g.required' => 'Carbohydrates are required.',
            'carbs_g.numeric' => 'Carbohydrates must be a number.',
            'carbs_g.min' => 'Carbohydrates cannot be negative.',
            'carbs_g.max' => 'Carbohydrates cannot exceed 1000g.',
            'fats_g.required' => 'Fats are required.',
            'fats_g.numeric' => 'Fats must be a number.',
            'fats_g.min' => 'Fats cannot be negative.',
            'fats_g.max' => 'Fats cannot exceed 500g.',
            'water_ml.integer' => 'Water must be an integer.',
            'water_ml.min' => 'Water cannot be negative.',
            'water_ml.max' => 'Water cannot exceed 10000ml.',
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

