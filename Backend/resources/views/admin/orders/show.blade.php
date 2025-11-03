@extends('admin.layouts.app')

@section('title', 'Order Details')
@section('page-title', 'Order #' . $order->id)

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
            <h3 class="text-lg font-semibold mb-4">Order Information</h3>
            <div class="space-y-2">
                <div>
                    <p class="text-gray-600">Order ID</p>
                    <p class="font-semibold">#{{ $order->id }}</p>
                </div>
                <div>
                    <p class="text-gray-600">Status</p>
                    <span class="px-2 py-1 text-xs rounded-full 
                        {{ $order->status == 'paid' ? 'bg-green-100 text-green-800' : '' }}
                        {{ $order->status == 'pending' ? 'bg-yellow-100 text-yellow-800' : '' }}
                        {{ $order->status == 'failed' ? 'bg-red-100 text-red-800' : '' }}">
                        {{ ucfirst($order->status) }}
                    </span>
                </div>
                <div>
                    <p class="text-gray-600">Amount</p>
                    <p class="font-semibold">${{ number_format($order->amount_cents / 100, 2) }} {{ $order->currency }}</p>
                </div>
                <div>
                    <p class="text-gray-600">Provider</p>
                    <p class="font-semibold">{{ ucfirst($order->provider) }}</p>
                </div>
                <div>
                    <p class="text-gray-600">Provider Reference</p>
                    <p class="font-semibold">{{ $order->provider_ref ?? 'N/A' }}</p>
                </div>
                <div>
                    <p class="text-gray-600">Created At</p>
                    <p class="font-semibold">{{ $order->created_at->format('M d, Y H:i') }}</p>
                </div>
            </div>
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-4">User Information</h3>
            <div class="space-y-2">
                <div>
                    <p class="text-gray-600">Name</p>
                    <p class="font-semibold">{{ $order->user->name }}</p>
                </div>
                <div>
                    <p class="text-gray-600">Email</p>
                    <p class="font-semibold">{{ $order->user->email }}</p>
                </div>
            </div>

            <h3 class="text-lg font-semibold mb-4 mt-6">Product Information</h3>
            <div class="space-y-2">
                <div>
                    <p class="text-gray-600">Product Name</p>
                    <p class="font-semibold">{{ $order->product->name }}</p>
                </div>
                <div>
                    <p class="text-gray-600">Interval</p>
                    <p class="font-semibold">{{ ucfirst($order->product->interval) }}</p>
                </div>
            </div>
        </div>
    </div>

    @if($order->meta)
        <div class="border-t pt-4">
            <h3 class="text-lg font-semibold mb-2">Metadata</h3>
            <pre class="bg-gray-100 p-4 rounded text-sm">{{ json_encode($order->meta, JSON_PRETTY_PRINT) }}</pre>
        </div>
    @endif
</div>
@endsection

