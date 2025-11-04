@extends('admin.layouts.app')

@section('title', 'Notification Details')
@section('page-title', 'Notification Details')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-start mb-4">
        <div>
            <h3 class="text-2xl font-bold">{{ $notification->title }}</h3>
        </div>
        <div class="flex gap-2">
            <a href="{{ route('admin.notifications.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-arrow-left mr-2"></i>Back
            </a>
            <form action="{{ route('admin.notifications.destroy', $notification) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-trash mr-2"></i>Delete
                </button>
            </form>
        </div>
    </div>

    <div class="space-y-4">
        <div>
            <span class="text-gray-500 text-sm">Message</span>
            <p class="font-semibold mt-1 text-gray-900 whitespace-pre-wrap">{{ $notification->message }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <span class="text-gray-500 text-sm">Sent To</span>
                <p class="font-semibold">
                    @if($notification->user_id)
                        <span class="text-blue-600">{{ $notification->user->name ?? 'User #' . $notification->user_id }}</span>
                        <span class="text-gray-400">({{ $notification->user->email ?? 'N/A' }})</span>
                    @else
                        <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">All Users</span>
                    @endif
                </p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Sent By</span>
                <p class="font-semibold">{{ $notification->admin->name ?? 'Unknown' }}</p>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <span class="text-gray-500 text-sm">Sent At</span>
                <p class="font-semibold">
                    {{ $notification->sent_at ? $notification->sent_at->format('M d, Y H:i') : $notification->created_at->format('M d, Y H:i') }}
                </p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Created At</span>
                <p class="font-semibold">{{ $notification->created_at->format('M d, Y H:i') }}</p>
            </div>
        </div>
    </div>
</div>
@endsection
