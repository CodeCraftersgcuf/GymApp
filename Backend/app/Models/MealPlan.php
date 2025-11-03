<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MealPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'coach_id',
        'title',
        'kcal_target',
        'protein_target_g',
        'carbs_target_g',
        'fats_target_g',
        'is_public',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'kcal_target' => 'integer',
            'protein_target_g' => 'decimal:2',
            'carbs_target_g' => 'decimal:2',
            'fats_target_g' => 'decimal:2',
            'is_public' => 'boolean',
        ];
    }

    /**
     * Get the user (if custom plan).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the coach (if created by coach).
     */
    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    /**
     * Get meals for this plan.
     */
    public function meals()
    {
        return $this->hasMany(Meal::class)->orderBy('order');
    }
}
