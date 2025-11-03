<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug',
        'name',
        'description',
        'price_cents',
        'interval',
        'active',
        'features',
    ];

    protected function casts(): array
    {
        return [
            'price_cents' => 'integer',
            'active' => 'boolean',
            'features' => 'array',
        ];
    }

    /**
     * Get orders for this product.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get subscriptions for this product.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
