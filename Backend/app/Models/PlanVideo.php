<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanVideo extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'title',
        'description',
        'youtube_url',
        'thumbnail_url',
        'duration_seconds',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'duration_seconds' => 'integer',
            'order' => 'integer',
        ];
    }

    /**
     * Get the plan that owns this video.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Extract YouTube video ID from URL.
     */
    public function getYoutubeIdAttribute()
    {
        preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $this->youtube_url, $matches);
        return $matches[1] ?? null;
    }
}

