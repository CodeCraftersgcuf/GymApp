<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine if the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Only admins can view all users
        return $user->hasRole('Admin');
    }

    /**
     * Determine if the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // Users can view their own profile
        // Admins can view any profile
        // Coaches can view their clients' profiles
        if ($user->id === $model->id) {
            return true;
        }

        if ($user->hasRole('Admin')) {
            return true;
        }

        // Check if this is a coach viewing their client
        if ($user->hasRole('Coach')) {
            return $user->userPrograms()
                ->where('user_id', $model->id)
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
        // Only admins can create users directly
        return $user->hasRole('Admin');
    }

    /**
     * Determine if the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Users can update their own profile
        // Admins can update any profile
        // Coaches can update their clients' profiles
        if ($user->id === $model->id) {
            return true;
        }

        if ($user->hasRole('Admin')) {
            return true;
        }

        // Check if this is a coach updating their client
        if ($user->hasRole('Coach')) {
            return $user->userPrograms()
                ->where('user_id', $model->id)
                ->where('status', 'active')
                ->exists();
        }

        return false;
    }

    /**
     * Determine if the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Only admins can delete users
        // Users cannot delete themselves
        return $user->hasRole('Admin') && $user->id !== $model->id;
    }

    /**
     * Determine if the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        // Only admins can restore deleted users
        return $user->hasRole('Admin');
    }

    /**
     * Determine if the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        // Only admins can permanently delete users
        return $user->hasRole('Admin');
    }
}
