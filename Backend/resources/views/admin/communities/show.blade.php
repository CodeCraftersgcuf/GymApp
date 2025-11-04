@extends('admin.layouts.app')

@section('title', 'Social Media Link Details')
@section('page-title', 'Social Media Link Details')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-start mb-4">
        <div>
            <h3 class="text-2xl font-bold">{{ $community->platform }}</h3>
        </div>
        <div class="flex gap-2">
            <a href="{{ route('admin.communities.edit', $community) }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-edit mr-2"></i>Edit
            </a>
            <form action="{{ route('admin.communities.destroy', $community) }}" method="POST" onsubmit="return confirm('Are you sure?')">
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
            <span class="text-gray-500 text-sm">Platform</span>
            <p class="font-semibold text-lg">{{ $community->platform }}</p>
        </div>

        <div>
            <span class="text-gray-500 text-sm">URL</span>
            <p class="font-semibold">
                <a href="{{ $community->url }}" target="_blank" class="text-blue-600 hover:underline break-all">
                    {{ $community->url }}
                </a>
            </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <span class="text-gray-500 text-sm">Order</span>
                <p class="font-semibold">{{ $community->order }}</p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Status</span>
                <p class="font-semibold">
                    @if($community->is_active)
                        <span class="text-green-600">Active</span>
                    @else
                        <span class="text-red-600">Inactive</span>
                    @endif
                </p>
            </div>
        </div>

        <div>
            <span class="text-gray-500 text-sm">Created At</span>
            <p class="font-semibold">{{ $community->created_at->format('M d, Y H:i') }}</p>
        </div>

        <div>
            <span class="text-gray-500 text-sm">Updated At</span>
            <p class="font-semibold">{{ $community->updated_at->format('M d, Y H:i') }}</p>
        </div>
    </div>
</div>
@endsection
