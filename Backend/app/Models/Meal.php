<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = [
        'meal_plan_id',
        'title',
        'order',
        'meal_type',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    /**
     * Get the meal plan.
     */
    public function mealPlan()
    {
        return $this->belongsTo(MealPlan::class);
    }

    /**
     * Get meal items for this meal.
     */
    public function mealItems()
    {
        return $this->hasMany(MealItem::class)->orderBy('order');
    }
}
