@extends('admin.layouts.app')

@section('title', 'Edit Video Library')
@section('page-title', 'Edit Video Library: ' . $videoLibrary->title)

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.video-libraries.update', $videoLibrary) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input type="text" name="title" value="{{ old('title', $videoLibrary->title) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('title')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea name="description" rows="3"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">{{ old('description', $videoLibrary->description) }}</textarea>
                @error('description')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Current Image</label>
                @if($videoLibrary->getFirstMediaUrl('images'))
                    <img src="{{ $videoLibrary->getFirstMediaUrl('images') }}" alt="{{ $videoLibrary->title }}" 
                         class="h-32 w-32 object-cover rounded mb-2">
                @else
                    <p class="text-gray-400">No image uploaded</p>
                @endif
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Update Image (Optional)</label>
                <input type="file" name="image" accept="image/jpeg,image/png,image/jpg,image/gif"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <p class="text-gray-500 text-xs mt-1">Leave empty to keep current image (max 2MB)</p>
                @error('image')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Display Order</label>
                <input type="number" name="order" value="{{ old('order', $videoLibrary->order) }}" min="0"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <p class="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
                @error('order')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="flex items-center mt-8">
                <label class="flex items-center">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', $videoLibrary->is_active) ? 'checked' : '' }} class="mr-2">
                    <span class="text-gray-700 text-sm font-bold">Active</span>
                </label>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update Video Library
            </button>
            <a href="{{ route('admin.video-libraries.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection
