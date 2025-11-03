<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Exercise extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'title',
        'equipment',
        'primary_muscle',
        'difficulty',
        'description',
        'video_url',
        'instructions',
    ];

    /**
     * Get workouts that include this exercise.
     */
    public function workouts()
    {
        return $this->belongsToMany(Workout::class, 'exercise_workout')
            ->withPivot(['sets', 'reps_min', 'reps_max', 'rest_seconds', 'tempo', 'order']);
    }

    /**
     * Get set logs for this exercise.
     */
    public function setLogs()
    {
        return $this->hasMany(SetLog::class);
    }
}
