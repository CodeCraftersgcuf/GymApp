<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MealItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'meal_id',
        'food_id',
        'servings',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'servings' => 'decimal:2',
            'order' => 'integer',
        ];
    }

    /**
     * Get the meal.
     */
    public function meal()
    {
        return $this->belongsTo(Meal::class);
    }

    /**
     * Get the food.
     */
    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}
