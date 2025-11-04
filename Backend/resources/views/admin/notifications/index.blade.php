@extends('admin.layouts.app')

@section('title', 'Notifications')
@section('page-title', 'Notifications Management')

@section('content')
<div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">All Notifications</h3>
            <a href="{{ route('admin.notifications.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-plus mr-2"></i>Send Notification
            </a>
        </div>
    </div>

    <div class="p-6">
        <form method="GET" action="{{ route('admin.notifications.index') }}" class="mb-4 flex gap-2">
            <select name="user_type" class="shadow border rounded py-2 px-3">
                <option value="">All Types</option>
                <option value="all" {{ request('user_type') == 'all' ? 'selected' : '' }}>All Users</option>
                <option value="specific" {{ request('user_type') == 'specific' ? 'selected' : '' }}>Specific Users</option>
            </select>
            <button type="submit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-search"></i> Filter
            </button>
            <a href="{{ route('admin.notifications.index') }}" class="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-times"></i> Clear
            </a>
        </form>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent To</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent By</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent At</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($notifications as $notification)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap font-semibold">{{ $notification->title }}</td>
                            <td class="px-6 py-4">
                                <p class="text-sm text-gray-600 line-clamp-2">{{ Str::limit($notification->message, 80) }}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($notification->user_id)
                                    <span class="text-blue-600">{{ $notification->user->name ?? 'User #' . $notification->user_id }}</span>
                                @else
                                    <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">All Users</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                {{ $notification->admin->name ?? 'Unknown' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $notification->sent_at ? $notification->sent_at->format('M d, Y H:i') : $notification->created_at->format('M d, Y H:i') }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="{{ route('admin.notifications.show', $notification) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-eye"></i> View
                                </a>
                                <form action="{{ route('admin.notifications.destroy', $notification) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-600 hover:text-red-900">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No notifications found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="mt-4">
            {{ $notifications->links() }}
        </div>
    </div>
</div>
@endsection
