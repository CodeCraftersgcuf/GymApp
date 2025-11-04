<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    /**
     * Send a message to admin.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $message = Message::create([
            'user_id' => auth()->id(),
            'message' => $validated['message'],
            'sender_type' => 'user',
            'is_read' => false,
        ]);

        return response()->json([
            'data' => [
                'id' => $message->id,
                'message' => $message->message,
                'sender_type' => $message->sender_type,
                'created_at' => $message->created_at->toIso8601String(),
            ],
        ], 201);
    }

    /**
     * Get all messages for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Message::where('user_id', auth()->id())
            ->orderBy('created_at', 'asc');

        // Optional pagination
        if ($request->has('page')) {
            $messages = $query->paginate($request->get('per_page', 50));
        } else {
            $messages = $query->get();
        }

        // Mark user's received messages (from admin) as read
        Message::where('user_id', auth()->id())
            ->where('sender_type', 'admin')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'data' => $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'message' => $message->message,
                    'sender_type' => $message->sender_type,
                    'is_read' => $message->is_read,
                    'created_at' => $message->created_at->toIso8601String(),
                    'admin_name' => $message->admin?->name,
                ];
            }),
            'meta' => $request->has('page') ? [
                'current_page' => $messages->currentPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
                'last_page' => $messages->lastPage(),
            ] : null,
        ]);
    }

    /**
     * Get unread message count.
     */
    public function unreadCount(): JsonResponse
    {
        $count = Message::where('user_id', auth()->id())
            ->where('sender_type', 'admin')
            ->where('is_read', false)
            ->count();

        return response()->json([
            'data' => [
                'unread_count' => $count,
            ],
        ]);
    }

    /**
     * Get WhatsApp support number.
     */
    public function whatsappSupport(): JsonResponse
    {
        $whatsappNumber = Settings::get('whatsapp_support_number');

        return response()->json([
            'data' => [
                'whatsapp_support_number' => $whatsappNumber,
                'whatsapp_link' => $whatsappNumber ? 'https://wa.me/' . preg_replace('/[^0-9]/', '', $whatsappNumber) : null,
            ],
        ]);
    }
}
