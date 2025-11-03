<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Food extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'serving_unit',
        'serving_size',
        'kcal',
        'protein_g',
        'carbs_g',
        'fats_g',
        'locale',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'serving_size' => 'decimal:2',
            'kcal' => 'integer',
            'protein_g' => 'decimal:2',
            'carbs_g' => 'decimal:2',
            'fats_g' => 'decimal:2',
        ];
    }

    /**
     * Get meal items using this food.
     */
    public function mealItems()
    {
        return $this->hasMany(MealItem::class);
    }
}
