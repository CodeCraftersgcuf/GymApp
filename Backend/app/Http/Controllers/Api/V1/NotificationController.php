<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Get user's notifications.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Notification::where(function ($q) use ($user) {
            // Get notifications for this user or notifications sent to all users (user_id is null)
            $q->where('user_id', $user->id)
              ->orWhereNull('user_id');
        })
        ->latest();

        // Filter by read status
        if ($request->has('status')) {
            if ($request->status === 'unread') {
                $query->where('is_read', false);
            } elseif ($request->status === 'read') {
                $query->where('is_read', true);
            }
        }

        $perPage = $request->get('per_page', 20);
        $notifications = $query->paginate($perPage);

        return response()->json([
            'data' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    /**
     * Get unread count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = Notification::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhereNull('user_id');
        })
        ->where('is_read', false)
        ->count();

        return response()->json([
            'data' => [
                'unread_count' => $count,
            ],
        ]);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $notification = Notification::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhereNull('user_id');
        })
        ->findOrFail($id);

        $notification->markAsRead();

        return response()->json([
            'data' => $notification->fresh(),
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = $request->user();

        $updated = Notification::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhereNull('user_id');
        })
        ->where('is_read', false)
        ->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => "{$updated} notification(s) marked as read",
            'updated_count' => $updated,
        ]);
    }

    /**
     * Show single notification.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $notification = Notification::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhereNull('user_id');
        })
        ->findOrFail($id);

        // Mark as read when viewing
        if (!$notification->is_read) {
            $notification->markAsRead();
        }

        return response()->json([
            'data' => $notification,
        ]);
    }
}
