<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkoutLog;

class WorkoutLogPolicy
{
    /**
     * Determine if the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view their own workout logs
        return true;
    }

    /**
     * Determine if the user can view the model.
     */
    public function view(User $user, WorkoutLog $workoutLog): bool
    {
        // Users can view their own workout logs
        if ($workoutLog->user_id === $user->id) {
            return true;
        }

        // Admins can view any workout log
        if ($user->hasRole('Admin')) {
            return true;
        }

        // Coaches can view their clients' workout logs
        if ($user->hasRole('Coach')) {
            return $user->userPrograms()
                ->where('user_id', $workoutLog->user_id)
                ->where('status', 'active')
                ->exists();
        }

        return false;
    }

    /**
     * Determine if the user can create models.
     */
    public function create(User $user): bool
    {
        // All authenticated users can create workout logs
        return true;
    }

    /**
     * Determine if the user can update the model.
     */
    public function update(User $user, WorkoutLog $workoutLog): bool
    {
        // Users can update their own workout logs
        if ($workoutLog->user_id === $user->id) {
            return true;
        }

        // Admins can update any workout log
        if ($user->hasRole('Admin')) {
            return true;
        }

        // Coaches can update their clients' workout logs
        if ($user->hasRole('Coach')) {
            return $user->userPrograms()
                ->where('user_id', $workoutLog->user_id)
                ->where('status', 'active')
                ->exists();
        }

        return false;
    }

    /**
     * Determine if the user can delete the model.
     */
    public function delete(User $user, WorkoutLog $workoutLog): bool
    {
        // Users can delete their own workout logs
        if ($workoutLog->user_id === $user->id) {
            return true;
        }

        // Admins can delete any workout log
        if ($user->hasRole('Admin')) {
            return true;
        }

        // Coaches can delete their clients' workout logs
        if ($user->hasRole('Coach')) {
            return $user->userPrograms()
                ->where('user_id', $workoutLog->user_id)
                ->where('status', 'active')
                ->exists();
        }

        return false;
    }

    /**
     * Determine if the user can restore the model.
     */
    public function restore(User $user, WorkoutLog $workoutLog): bool
    {
        // Only admins can restore deleted workout logs
        return $user->hasRole('Admin');
    }

    /**
     * Determine if the user can permanently delete the model.
     */
    public function forceDelete(User $user, WorkoutLog $workoutLog): bool
    {
        // Only admins can permanently delete workout logs
        return $user->hasRole('Admin');
    }
}
