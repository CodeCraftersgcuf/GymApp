<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SetLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'workout_log_id',
        'exercise_id',
        'set_number',
        'weight_kg',
        'reps',
        'rpe',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'set_number' => 'integer',
            'weight_kg' => 'decimal:2',
            'reps' => 'integer',
            'rpe' => 'decimal:1',
        ];
    }

    /**
     * Get the workout log.
     */
    public function workoutLog()
    {
        return $this->belongsTo(WorkoutLog::class);
    }

    /**
     * Get the exercise.
     */
    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
