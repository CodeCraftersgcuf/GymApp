<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'workout_id',
        'performed_at',
        'duration_minutes',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'performed_at' => 'datetime',
            'duration_minutes' => 'integer',
        ];
    }

    /**
     * Get the user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the workout.
     */
    public function workout()
    {
        return $this->belongsTo(Workout::class);
    }

    /**
     * Get set logs for this workout log.
     */
    public function setLogs()
    {
        return $this->hasMany(SetLog::class);
    }
}
