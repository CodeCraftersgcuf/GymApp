<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NutritionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'logged_at',
        'kcal',
        'protein_g',
        'carbs_g',
        'fats_g',
        'water_ml',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'logged_at' => 'date',
            'kcal' => 'integer',
            'protein_g' => 'decimal:2',
            'carbs_g' => 'decimal:2',
            'fats_g' => 'decimal:2',
            'water_ml' => 'integer',
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
