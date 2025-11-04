@extends('admin.layouts.app')

@section('title', 'Chat with ' . $user->name)
@section('page-title', 'Chat: ' . $user->name)

@section('content')
<div class="bg-white rounded-lg shadow">
    <!-- User Info Header -->
    <div class="p-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
            <div>
                <h3 class="font-semibold text-gray-900">{{ $user->name }}</h3>
                <p class="text-sm text-gray-600">{{ $user->email }}</p>
            </div>
            <div class="flex items-center gap-4">
                @if($whatsappNumber)
                    <div class="flex items-center gap-2 text-green-600">
                        <i class="fab fa-whatsapp"></i>
                        <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $whatsappNumber) }}" 
                           target="_blank" 
                           class="text-sm hover:underline">
                            {{ $whatsappNumber }}
                        </a>
                    </div>
                @endif
                <a href="{{ route('admin.chat.index') }}" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Conversations
                </a>
            </div>
        </div>
    </div>

    <!-- Messages Container -->
    <div class="p-6" style="height: 500px; overflow-y: auto;" id="messagesContainer">
        <div class="space-y-4">
            @forelse($messages as $message)
                <div class="flex {{ $message->sender_type === 'admin' ? 'justify-end' : 'justify-start' }}">
                    <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg {{ $message->sender_type === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900' }}">
                        <p class="text-sm">{{ $message->message }}</p>
                        <p class="text-xs mt-1 opacity-75">
                            {{ $message->created_at->format('M d, H:i') }}
                        </p>
                    </div>
                </div>
            @empty
                <div class="text-center py-12 text-gray-500">
                    <i class="fas fa-comments text-4xl mb-4 opacity-50"></i>
                    <p>No messages yet. Start the conversation!</p>
                    @if($whatsappNumber)
                        <p class="text-sm mt-2">
                            You can also reach the user via WhatsApp: 
                            <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $whatsappNumber) }}" 
                               target="_blank" 
                               class="text-green-600 hover:underline">
                                {{ $whatsappNumber }}
                            </a>
                        </p>
                    @endif
                </div>
            @endforelse
        </div>
    </div>

    <!-- Message Input Form -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
        <form method="POST" action="{{ route('admin.chat.send', $user) }}" id="messageForm">
            @csrf
            <div class="flex gap-2">
                <textarea 
                    name="message" 
                    id="messageInput"
                    rows="2"
                    placeholder="Type your message..."
                    required
                    class="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button 
                    type="submit"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded flex items-center gap-2"
                >
                    <i class="fas fa-paper-plane"></i>
                    Send
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
    // Auto-scroll to bottom on page load
    document.addEventListener('DOMContentLoaded', function() {
        const container = document.getElementById('messagesContainer');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }

        // Focus message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
    });

    // Optional: Auto-refresh messages every 5 seconds
    // Uncomment if you want real-time updates
    // setInterval(function() {
    //     window.location.reload();
    // }, 5000);
</script>
@endpush
@endsection
