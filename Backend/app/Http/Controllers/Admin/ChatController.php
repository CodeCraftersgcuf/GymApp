<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Settings;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!auth()->check() || !auth()->user()->hasRole('Admin')) {
                abort(403);
            }
            return $next($request);
        });
    }

    /**
     * List all users who have sent messages (conversations list).
     */
    public function index(Request $request)
    {
        // Get unique user IDs who have sent messages
        $userIds = Message::select('user_id')
            ->distinct()
            ->pluck('user_id');

        // Get users with their message statistics using subqueries
        $conversations = User::whereIn('id', $userIds)
            ->select('users.*')
            ->selectRaw('(
                SELECT COUNT(*) 
                FROM messages 
                WHERE messages.user_id = users.id 
                AND messages.is_read = 0 
                AND messages.sender_type = "user"
            ) as unread_count')
            ->selectRaw('(
                SELECT MAX(messages.created_at) 
                FROM messages 
                WHERE messages.user_id = users.id
            ) as last_message_at')
            ->selectRaw('(
                SELECT message 
                FROM messages 
                WHERE messages.user_id = users.id 
                ORDER BY messages.created_at DESC 
                LIMIT 1
            ) as last_message')
            ->orderBy('last_message_at', 'desc')
            ->paginate(20);

        // Get WhatsApp support number
        $whatsappNumber = Settings::get('whatsapp_support_number');

        return view('admin.chat.index', compact('conversations', 'whatsappNumber'));
    }

    /**
     * Update WhatsApp support number.
     */
    public function updateWhatsAppNumber(Request $request)
    {
        $validated = $request->validate([
            'whatsapp_number' => 'nullable|string|max:255',
        ]);

        Settings::set(
            'whatsapp_support_number',
            $validated['whatsapp_number'] ?? null,
            'WhatsApp support number for customer chat support'
        );

        return redirect()->route('admin.chat.index')->with('success', 'WhatsApp support number updated successfully.');
    }

    /**
     * Show chat conversation with a specific user.
     */
    public function show(User $user)
    {
        // Mark all user messages as read
        Message::where('user_id', $user->id)
            ->where('sender_type', 'user')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        // Get all messages for this user
        $messages = Message::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        // Get WhatsApp support number
        $whatsappNumber = Settings::get('whatsapp_support_number');

        return view('admin.chat.show', compact('user', 'messages', 'whatsappNumber'));
    }

    /**
     * Send a message to a user (admin response).
     */
    public function sendMessage(Request $request, User $user)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        Message::create([
            'user_id' => $user->id,
            'admin_id' => auth()->id(),
            'message' => $validated['message'],
            'sender_type' => 'admin',
            'is_read' => false,
        ]);

        return redirect()->route('admin.chat.show', $user)->with('success', 'Message sent successfully.');
    }
}
