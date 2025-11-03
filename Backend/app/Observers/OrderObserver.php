<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\AuditLog;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        $this->logAudit($order, 'created');
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if ($order->wasChanged('status')) {
            $this->logAudit($order, "status_changed_to_{$order->status}");
        }
    }

    private function logAudit(Order $order, string $action): void
    {
        AuditLog::create([
            'user_id' => $order->user_id,
            'action' => "order.{$action}",
            'entity_type' => Order::class,
            'entity_id' => $order->id,
            'meta' => [
                'amount_cents' => $order->amount_cents,
                'status' => $order->status,
                'provider' => $order->provider,
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
