@extends('admin.layouts.app')

@section('title', 'Send Notification')
@section('page-title', 'Send New Notification')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.notifications.store') }}">
        @csrf
        <div class="space-y-6">
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Title <span class="text-red-500">*</span></label>
                <input type="text" name="title" value="{{ old('title') }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                       placeholder="Enter notification title">
                @error('title')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Message <span class="text-red-500">*</span></label>
                <textarea name="message" rows="5" required
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                          placeholder="Enter notification message">{{ old('message') }}</textarea>
                @error('message')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Send To <span class="text-red-500">*</span></label>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="radio" name="send_to" value="all" {{ old('send_to', 'all') == 'all' ? 'checked' : '' }} 
                               class="mr-2" onchange="toggleUserSelection()">
                        <span>All Users</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="send_to" value="specific" {{ old('send_to') == 'specific' ? 'checked' : '' }} 
                               class="mr-2" onchange="toggleUserSelection()">
                        <span>Specific Users</span>
                    </label>
                </div>
                @error('send_to')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div id="userSelection" style="display: {{ old('send_to') == 'specific' ? 'block' : 'none' }};">
                <label class="block text-gray-700 text-sm font-bold mb-2">Select Users <span class="text-red-500">*</span></label>
                <div class="border rounded p-4 max-h-64 overflow-y-auto">
                    <div class="mb-2">
                        <button type="button" onclick="selectAll()" class="text-sm text-blue-600 hover:underline">
                            Select All
                        </button>
                        <button type="button" onclick="deselectAll()" class="text-sm text-blue-600 hover:underline ml-4">
                            Deselect All
                        </button>
                    </div>
                    <div class="space-y-2">
                        @foreach($users as $user)
                            <label class="flex items-center">
                                <input type="checkbox" name="user_ids[]" value="{{ $user->id }}" 
                                       {{ in_array($user->id, old('user_ids', [])) ? 'checked' : '' }}
                                       class="mr-2 user-checkbox">
                                <span>{{ $user->name }} ({{ $user->email }})</span>
                                @if($user->user_type)
                                    <span class="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                        {{ ucfirst($user->user_type) }}
                                    </span>
                                @endif
                            </label>
                        @endforeach
                    </div>
                </div>
                @error('user_ids')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-paper-plane mr-2"></i>Send Notification
            </button>
            <a href="{{ route('admin.notifications.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>

@push('scripts')
<script>
function toggleUserSelection() {
    const sendTo = document.querySelector('input[name="send_to"]:checked').value;
    const userSelection = document.getElementById('userSelection');
    
    if (sendTo === 'specific') {
        userSelection.style.display = 'block';
    } else {
        userSelection.style.display = 'none';
        // Uncheck all user checkboxes
        document.querySelectorAll('.user-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

function selectAll() {
    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
        checkbox.checked = true;
    });
}

function deselectAll() {
    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
}
</script>
@endpush
@endsection
