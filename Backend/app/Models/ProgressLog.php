<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgressLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'logged_at',
        'weight_kg',
        'body_fat_percent',
        'chest_cm',
        'waist_cm',
        'hips_cm',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'logged_at' => 'date',
            'weight_kg' => 'decimal:2',
            'body_fat_percent' => 'decimal:2',
            'chest_cm' => 'decimal:2',
            'waist_cm' => 'decimal:2',
            'hips_cm' => 'decimal:2',
        ];
    }

    /**
     * Get the user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
