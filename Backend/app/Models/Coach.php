<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coach extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'bio',
        'certifications',
        'specialties',
    ];

    protected function casts(): array
    {
        return [
            'certifications' => 'array',
            'specialties' => 'array',
        ];
    }

    /**
     * Get the user that owns this coach profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get programs created by this coach.
     */
    public function programs()
    {
        return $this->hasMany(Program::class);
    }

    /**
     * Get clients (users assigned to this coach).
     */
    public function clients()
    {
        return $this->hasManyThrough(
            User::class,
            UserProgram::class,
            'coach_id',
            'id',
            'user_id',
            'user_id'
        );
    }

    /**
     * Get check-ins for this coach.
     */
    public function checkIns()
    {
        return $this->hasMany(CheckIn::class, 'coach_id');
    }
}
