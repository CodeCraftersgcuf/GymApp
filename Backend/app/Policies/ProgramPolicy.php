<?php

namespace App\Policies;

use App\Models\Program;
use App\Models\User;

class ProgramPolicy
{
    /**
     * Determine if the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Everyone can view public programs
        return true;
    }

    /**
     * Determine if the user can view the model.
     */
    public function view(User $user, Program $program): bool
    {
        // Public programs are visible to all
        if ($program->is_public) {
            return true;
        }

        // Admins can view all programs
        if ($user->hasRole('Admin')) {
            return true;
        }

        // Coaches can view their own programs
        if ($program->coach_id === $user->id) {
            return true;
        }

        // Users can view programs they're subscribed to
        return $user->userPrograms()
            ->where('program_id', $program->id)
            ->where('status', 'active')
            ->exists();
    }

    /**
     * Determine if the user can create models.
     */
    public function create(User $user): bool
    {
        // Only coaches and admins can create programs
        return $user->hasRole('Coach') || $user->hasRole('Admin');
    }

    /**
     * Determine if the user can update the model.
     */
    public function update(User $user, Program $program): bool
    {
        // Admins can update any program
        if ($user->hasRole('Admin')) {
            return true;
        }

        // Coaches can update their own programs
        return $program->coach_id === $user->id && $user->hasRole('Coach');
    }

    /**
     * Determine if the user can delete the model.
     */
    public function delete(User $user, Program $program): bool
    {
        // Admins can delete any program
        if ($user->hasRole('Admin')) {
            return true;
        }

        // Coaches can delete their own programs (if no active subscriptions)
        if ($program->coach_id === $user->id && $user->hasRole('Coach')) {
            // Check if program has active subscriptions
            return !$program->userPrograms()
                ->where('status', 'active')
                ->exists();
        }

        return false;
    }

    /**
     * Determine if the user can restore the model.
     */
    public function restore(User $user, Program $program): bool
    {
        // Only admins can restore deleted programs
        return $user->hasRole('Admin');
    }

    /**
     * Determine if the user can permanently delete the model.
     */
    public function forceDelete(User $user, Program $program): bool
    {
        // Only admins can permanently delete programs
        return $user->hasRole('Admin');
    }
}
