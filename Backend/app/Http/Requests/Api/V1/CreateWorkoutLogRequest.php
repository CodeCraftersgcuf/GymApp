<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateWorkoutLogRequest extends FormRequest
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
            'workout_id' => 'required|exists:workouts,id',
            'performed_at' => 'required|date',
            'duration_minutes' => 'nullable|integer|min:1|max:600',
            'notes' => 'nullable|string|max:1000',
            'sets' => 'required|array|min:1',
            'sets.*.exercise_id' => 'required|exists:exercises,id',
            'sets.*.set_number' => 'required|integer|min:1',
            'sets.*.weight_kg' => 'nullable|numeric|min:0|max:1000',
            'sets.*.reps' => 'required|integer|min:1|max:1000',
            'sets.*.rpe' => 'nullable|numeric|min:1|max:10',
            'sets.*.notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'workout_id.required' => 'Workout ID is required.',
            'workout_id.exists' => 'The selected workout does not exist.',
            'performed_at.required' => 'Performed date is required.',
            'performed_at.date' => 'Performed date must be a valid date.',
            'duration_minutes.integer' => 'Duration must be an integer.',
            'duration_minutes.min' => 'Duration must be at least 1 minute.',
            'duration_minutes.max' => 'Duration cannot exceed 600 minutes.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
            'sets.required' => 'At least one set is required.',
            'sets.min' => 'At least one set is required.',
            'sets.*.exercise_id.required' => 'Exercise ID is required for each set.',
            'sets.*.exercise_id.exists' => 'One or more selected exercises do not exist.',
            'sets.*.set_number.required' => 'Set number is required.',
            'sets.*.set_number.integer' => 'Set number must be an integer.',
            'sets.*.set_number.min' => 'Set number must be at least 1.',
            'sets.*.weight_kg.numeric' => 'Weight must be a number.',
            'sets.*.weight_kg.min' => 'Weight cannot be negative.',
            'sets.*.reps.required' => 'Reps are required for each set.',
            'sets.*.reps.integer' => 'Reps must be an integer.',
            'sets.*.reps.min' => 'Reps must be at least 1.',
            'sets.*.rpe.numeric' => 'RPE must be a number.',
            'sets.*.rpe.min' => 'RPE must be at least 1.',
            'sets.*.rpe.max' => 'RPE cannot exceed 10.',
            'sets.*.notes.max' => 'Set notes cannot exceed 500 characters.',
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

