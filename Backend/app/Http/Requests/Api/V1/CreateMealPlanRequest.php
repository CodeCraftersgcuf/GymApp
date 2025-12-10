<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateMealPlanRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'kcal_target' => 'required|integer|min:0|max:20000',
            'protein_target_g' => 'required|numeric|min:0|max:1000',
            'carbs_target_g' => 'required|numeric|min:0|max:2000',
            'fats_target_g' => 'required|numeric|min:0|max:1000',
            'description' => 'nullable|string|max:2000',
            'meals' => 'required|array|min:1',
            'meals.*.title' => 'required|string|max:255',
            'meals.*.meal_type' => 'required|in:breakfast,lunch,dinner,snack',
            'meals.*.order' => 'required|integer|min:0',
            'meals.*.items' => 'required|array|min:1',
            'meals.*.items.*.food_id' => 'required|exists:foods,id',
            'meals.*.items.*.servings' => 'required|numeric|min:0.1|max:100',
            'meals.*.items.*.order' => 'required|integer|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID is required.',
            'user_id.exists' => 'The selected user does not exist.',
            'title.required' => 'Title is required.',
            'title.max' => 'Title cannot exceed 255 characters.',
            'kcal_target.required' => 'Calorie target is required.',
            'kcal_target.integer' => 'Calorie target must be an integer.',
            'kcal_target.min' => 'Calorie target cannot be negative.',
            'kcal_target.max' => 'Calorie target cannot exceed 20000.',
            'protein_target_g.required' => 'Protein target is required.',
            'protein_target_g.numeric' => 'Protein target must be a number.',
            'protein_target_g.min' => 'Protein target cannot be negative.',
            'carbs_target_g.required' => 'Carbohydrate target is required.',
            'carbs_target_g.numeric' => 'Carbohydrate target must be a number.',
            'carbs_target_g.min' => 'Carbohydrate target cannot be negative.',
            'fats_target_g.required' => 'Fat target is required.',
            'fats_target_g.numeric' => 'Fat target must be a number.',
            'fats_target_g.min' => 'Fat target cannot be negative.',
            'description.max' => 'Description cannot exceed 2000 characters.',
            'meals.required' => 'At least one meal is required.',
            'meals.min' => 'At least one meal is required.',
            'meals.*.title.required' => 'Meal title is required.',
            'meals.*.meal_type.required' => 'Meal type is required.',
            'meals.*.meal_type.in' => 'Meal type must be one of: breakfast, lunch, dinner, snack.',
            'meals.*.order.required' => 'Meal order is required.',
            'meals.*.order.integer' => 'Meal order must be an integer.',
            'meals.*.items.required' => 'At least one item is required for each meal.',
            'meals.*.items.min' => 'At least one item is required for each meal.',
            'meals.*.items.*.food_id.required' => 'Food ID is required for each item.',
            'meals.*.items.*.food_id.exists' => 'One or more selected foods do not exist.',
            'meals.*.items.*.servings.required' => 'Servings are required for each item.',
            'meals.*.items.*.servings.numeric' => 'Servings must be a number.',
            'meals.*.items.*.servings.min' => 'Servings must be at least 0.1.',
            'meals.*.items.*.servings.max' => 'Servings cannot exceed 100.',
            'meals.*.items.*.order.required' => 'Item order is required.',
            'meals.*.items.*.order.integer' => 'Item order must be an integer.',
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

