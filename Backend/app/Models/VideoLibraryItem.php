<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoLibraryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'video_library_id',
        'title',
        'youtube_url',
        'description',
        'notes',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    /**
     * Get the video library that owns this item.
     */
    public function videoLibrary()
    {
        return $this->belongsTo(VideoLibrary::class);
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
