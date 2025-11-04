@extends('admin.layouts.app')

@section('title', 'Chat')
@section('page-title', 'Chat Conversations')

@section('content')
<div class="space-y-6">
    <!-- WhatsApp Support Number Settings -->
    <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold">WhatsApp Support Settings</h3>
        </div>
        <div class="p-6">
            <form method="POST" action="{{ route('admin.chat.update-whatsapp') }}">
                @csrf
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">WhatsApp Support Number</label>
                        <input type="text" 
                               name="whatsapp_number" 
                               value="{{ old('whatsapp_number', $whatsappNumber) }}"
                               placeholder="e.g., +923001234567"
                               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                        <p class="text-gray-500 text-xs mt-1">This number will be visible to users in the chat interface</p>
                        @error('whatsapp_number')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
                    </div>
                    <div class="flex items-end">
                        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            <i class="fas fa-save mr-2"></i>Save WhatsApp Number
                        </button>
                    </div>
                </div>
            </form>
            @if($whatsappNumber)
                <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p class="text-sm text-green-800">
                        <i class="fas fa-check-circle mr-2"></i>
                        <strong>Current WhatsApp Number:</strong> 
                        <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $whatsappNumber) }}" 
                           target="_blank" 
                           class="text-blue-600 hover:underline">
                            {{ $whatsappNumber }}
                        </a>
                    </p>
                </div>
            @endif
        </div>
    </div>

    <!-- Conversations List -->
    <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold">All Conversations</h3>
        </div>

        <div class="p-6">
            @if($conversations->count() > 0)
                <div class="space-y-4">
                    @foreach($conversations as $conversation)
                        <a href="{{ route('admin.chat.show', $conversation) }}" 
                           class="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <h4 class="font-semibold text-gray-900">{{ $conversation->name }}</h4>
                                        @if($conversation->unread_count > 0)
                                            <span class="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                                {{ $conversation->unread_count }}
                                            </span>
                                        @endif
                                    </div>
                                    <p class="text-sm text-gray-600 mt-1">{{ $conversation->email }}</p>
                                    @if($conversation->last_message)
                                        <p class="text-sm text-gray-500 mt-2 line-clamp-2">
                                            {{ Str::limit($conversation->last_message, 100) }}
                                        </p>
                                    @endif
                                    <p class="text-xs text-gray-400 mt-2">
                                        {{ \Carbon\Carbon::parse($conversation->last_message_at)->diffForHumans() }}
                                    </p>
                                </div>
                                <div class="ml-4">
                                    <i class="fas fa-chevron-right text-gray-400"></i>
                                </div>
                            </div>
                        </a>
                    @endforeach
                </div>

                <div class="mt-6">
                    {{ $conversations->links() }}
                </div>
            @else
                <div class="text-center py-12">
                    <i class="fas fa-comments text-gray-300 text-6xl mb-4"></i>
                    <p class="text-gray-500 text-lg">No conversations yet</p>
                    <p class="text-gray-400 text-sm mt-2">When users send messages, they will appear here.</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
