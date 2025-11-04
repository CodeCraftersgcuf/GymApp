<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of notifications.
     */
    public function index(Request $request)
    {
        $query = Notification::with(['user', 'admin'])
            ->latest();

        // Filter by admin
        if ($request->has('admin_id') && $request->admin_id) {
            $query->where('admin_id', $request->admin_id);
        }

        // Filter by user (null means all users)
        if ($request->has('user_type')) {
            if ($request->user_type === 'all') {
                $query->whereNull('user_id');
            } elseif ($request->user_type === 'specific') {
                $query->whereNotNull('user_id');
            }
        }

        $notifications = $query->paginate(20);

        return view('admin.notifications.index', compact('notifications'));
    }

    /**
     * Show the form for creating a new notification.
     */
    public function create()
    {
        $users = User::where('user_type', '!=', 'admin')
            ->orderBy('name')
            ->get();

        return view('admin.notifications.create', compact('users'));
    }

    /**
     * Store a newly created notification.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'send_to' => 'required|in:all,specific',
            'user_ids' => 'required_if:send_to,specific|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $adminId = auth()->id();
        $sentAt = now();

        if ($validated['send_to'] === 'all') {
            // Send to all users (user_id is null)
            Notification::create([
                'title' => $validated['title'],
                'message' => $validated['message'],
                'user_id' => null,
                'admin_id' => $adminId,
                'sent_at' => $sentAt,
            ]);
        } else {
            // Send to specific users
            foreach ($validated['user_ids'] as $userId) {
                Notification::create([
                    'title' => $validated['title'],
                    'message' => $validated['message'],
                    'user_id' => $userId,
                    'admin_id' => $adminId,
                    'sent_at' => $sentAt,
                ]);
            }
        }

        return redirect()->route('admin.notifications.index')
            ->with('success', 'Notification(s) sent successfully!');
    }

    /**
     * Display the specified notification.
     */
    public function show(Notification $notification)
    {
        $notification->load(['user', 'admin']);

        return view('admin.notifications.show', compact('notification'));
    }

    /**
     * Remove the specified notification.
     */
    public function destroy(Notification $notification)
    {
        $notification->delete();

        return redirect()->route('admin.notifications.index')
            ->with('success', 'Notification deleted successfully!');
    }
}
