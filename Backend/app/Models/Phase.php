<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Phase extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'title',
        'order',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    /**
     * Get the program this phase belongs to.
     */
    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    /**
     * Get workouts for this phase.
     */
    public function workouts()
    {
        return $this->hasMany(Workout::class)->orderBy('day_of_week')->orderBy('order');
    }
}
