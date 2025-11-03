<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Program extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'coach_id',
        'title',
        'goal',
        'level',
        'duration_weeks',
        'is_public',
        'price_cents',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'price_cents' => 'integer',
            'duration_weeks' => 'integer',
        ];
    }

    /**
     * Get the coach that created this program.
     */
    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    /**
     * Get phases for this program.
     */
    public function phases()
    {
        return $this->hasMany(Phase::class)->orderBy('order');
    }

    /**
     * Get user subscriptions to this program.
     */
    public function userPrograms()
    {
        return $this->hasMany(UserProgram::class);
    }
}
