@extends('admin.layouts.app')

@section('title', 'Package Details')
@section('page-title', 'Package: ' . $package->title)

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-start mb-4">
        <div>
            <h3 class="text-2xl font-bold">{{ $package->title }}</h3>
        </div>
        <div class="flex gap-2">
            <a href="{{ route('admin.packages.edit', $package) }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-edit mr-2"></i>Edit
            </a>
            <form action="{{ route('admin.packages.destroy', $package) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-trash mr-2"></i>Delete
                </button>
            </form>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
            <h3 class="text-lg font-semibold mb-4">Payment Information</h3>
            <div class="space-y-2">
                <div>
                    <p class="text-gray-600 text-sm">Bank Name</p>
                    <p class="font-semibold">{{ $package->bank_name }}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Account Title</p>
                    <p class="font-semibold">{{ $package->account_title }}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Account Number</p>
                    <p class="font-semibold">{{ $package->account_number }}</p>
                </div>
            </div>
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-4">Package Details</h3>
            <div class="space-y-2">
                <div>
                    <p class="text-gray-600 text-sm">Status</p>
                    @if($package->is_active)
                        <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                    @else
                        <span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactive</span>
                    @endif
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Display Order</p>
                    <p class="font-semibold">{{ $package->order }}</p>
                </div>
                @if($package->whatsapp_number)
                    <div>
                        <p class="text-gray-600 text-sm">WhatsApp Number</p>
                        <p class="font-semibold">{{ $package->whatsapp_number }}</p>
                    </div>
                @endif
                <div>
                    <p class="text-gray-600 text-sm">Created At</p>
                    <p class="font-semibold">{{ $package->created_at->format('M d, Y H:i') }}</p>
                </div>
                <div>
                    <p class="text-gray-600 text-sm">Updated At</p>
                    <p class="font-semibold">{{ $package->updated_at->format('M d, Y H:i') }}</p>
                </div>
            </div>
        </div>
    </div>

    @if($package->description)
        <div class="border-t pt-4">
            <h3 class="text-lg font-semibold mb-2">Description/Instructions</h3>
            <p class="text-gray-700 whitespace-pre-line">{{ $package->description }}</p>
        </div>
    @endif
</div>
@endsection
