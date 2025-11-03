<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'image_url',
        'category',
        'difficulty',
        'duration_weeks',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'duration_weeks' => 'integer',
            'order' => 'integer',
        ];
    }

    /**
     * Get videos for this plan.
     */
    public function videos()
    {
        return $this->hasMany(PlanVideo::class)->orderBy('order');
    }
}

