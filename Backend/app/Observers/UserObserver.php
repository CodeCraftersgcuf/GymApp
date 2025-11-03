<?php

namespace App\Observers;

use App\Models\User;
use App\Models\AuditLog;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $this->logAudit($user, 'created');
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        $this->logAudit($user, 'updated');
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        $this->logAudit($user, 'deleted');
    }

    private function logAudit(User $user, string $action): void
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "user.{$action}",
            'entity_type' => User::class,
            'entity_id' => $user->id,
            'meta' => [
                'email' => $user->email,
                'name' => $user->name,
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
