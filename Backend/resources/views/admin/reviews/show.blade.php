@extends('admin.layouts.app')

@section('title', 'Review Details')
@section('page-title', 'Review Details')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-start mb-4">
        <div>
            <h3 class="text-2xl font-bold">Review #{{ $review->id }}</h3>
        </div>
        <div class="flex gap-2">
            <a href="{{ route('admin.reviews.edit', $review) }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-edit mr-2"></i>Edit
            </a>
            <form action="{{ route('admin.reviews.destroy', $review) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-trash mr-2"></i>Delete
                </button>
            </form>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h4 class="font-semibold mb-2">Image</h4>
            @if($review->getFirstMediaUrl('images'))
                <img src="{{ $review->getFirstMediaUrl('images') }}" alt="Review" 
                     class="w-full h-auto object-cover rounded border border-gray-200">
            @else
                <p class="text-gray-400">No image uploaded</p>
            @endif
        </div>

        <div class="space-y-4">
            @if($review->description)
                <div>
                    <span class="text-gray-500 text-sm">Description</span>
                    <p class="font-semibold">{{ $review->description }}</p>
                </div>
            @endif

            @if($review->video_link)
                <div>
                    <span class="text-gray-500 text-sm">Video Link</span>
                    <p class="font-semibold">
                        <a href="{{ $review->video_link }}" target="_blank" class="text-blue-600 hover:underline">
                            {{ $review->video_link }}
                        </a>
                    </p>
                </div>
            @endif

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <span class="text-gray-500 text-sm">Order</span>
                    <p class="font-semibold">{{ $review->order }}</p>
                </div>
                <div>
                    <span class="text-gray-500 text-sm">Status</span>
                    <p class="font-semibold">
                        @if($review->is_active)
                            <span class="text-green-600">Active</span>
                        @else
                            <span class="text-red-600">Inactive</span>
                        @endif
                    </p>
                </div>
            </div>

            <div>
                <span class="text-gray-500 text-sm">Created At</span>
                <p class="font-semibold">{{ $review->created_at->format('M d, Y H:i') }}</p>
            </div>

            <div>
                <span class="text-gray-500 text-sm">Updated At</span>
                <p class="font-semibold">{{ $review->updated_at->format('M d, Y H:i') }}</p>
            </div>
        </div>
    </div>
</div>
@endsection
