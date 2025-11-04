<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AchievementVideo extends Model
{
    use HasFactory;

    protected $fillable = [
        'achievement_id',
        'youtube_url',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    /**
     * Get the achievement that owns this video.
     */
    public function achievement()
    {
        return $this->belongsTo(Achievement::class);
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
