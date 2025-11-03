<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * User Model
 * 
 * Main user model with fitness app fields and relationships.
 */
class User extends Authenticatable implements MustVerifyEmail, HasMedia
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles, SoftDeletes, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'gender',
        'dob',
        'height_cm',
        'weight_kg',
        'goal',
        'locale',
        'timezone',
        'notification_token',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'notification_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'dob' => 'date',
            'password' => 'hashed',
            'height_cm' => 'decimal:2',
            'weight_kg' => 'decimal:2',
        ];
    }

    /**
     * Get the coach profile for this user.
     */
    public function coachProfile()
    {
        return $this->hasOne(Coach::class);
    }

    /**
     * Get programs created by this user (if coach).
     */
    public function createdPrograms()
    {
        return $this->hasMany(Program::class, 'coach_id');
    }

    /**
     * Get user's subscribed programs.
     */
    public function userPrograms()
    {
        return $this->hasMany(UserProgram::class);
    }

    /**
     * Get workout logs.
     */
    public function workoutLogs()
    {
        return $this->hasMany(WorkoutLog::class);
    }

    /**
     * Get nutrition logs.
     */
    public function nutritionLogs()
    {
        return $this->hasMany(NutritionLog::class);
    }

    /**
     * Get progress logs.
     */
    public function progressLogs()
    {
        return $this->hasMany(ProgressLog::class);
    }

    /**
     * Get check-ins.
     */
    public function checkIns()
    {
        return $this->hasMany(CheckIn::class);
    }

    /**
     * Get orders.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get subscriptions.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get audit logs.
     */
    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    /**
     * Check if user is a coach.
     */
    public function isCoach(): bool
    {
        return $this->hasRole('Coach') || $this->coachProfile()->exists();
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('Admin');
    }
}
