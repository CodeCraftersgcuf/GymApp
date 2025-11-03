<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workout extends Model
{
    use HasFactory;

    protected $fillable = [
        'phase_id',
        'title',
        'day_of_week',
        'notes',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
            'order' => 'integer',
        ];
    }

    /**
     * Get the phase this workout belongs to.
     */
    public function phase()
    {
        return $this->belongsTo(Phase::class);
    }

    /**
     * Get exercises for this workout.
     */
    public function exercises()
    {
        return $this->belongsToMany(Exercise::class, 'exercise_workout')
            ->withPivot(['sets', 'reps_min', 'reps_max', 'rest_seconds', 'tempo', 'order'])
            ->orderBy('exercise_workout.order');
    }

    /**
     * Get workout logs for this workout.
     */
    public function workoutLogs()
    {
        return $this->hasMany(WorkoutLog::class);
    }
}
