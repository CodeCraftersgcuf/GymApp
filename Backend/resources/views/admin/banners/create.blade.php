@extends('admin.layouts.app')

@section('title', 'Create Banner')
@section('page-title', 'Create New Banner')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.banners.store') }}" enctype="multipart/form-data">
        @csrf
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Title (Optional)</label>
                <input type="text" name="title" value="{{ old('title') }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                       placeholder="Banner title">
                @error('title')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Description (Optional)</label>
                <textarea name="description" rows="3"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                          placeholder="Banner description">{{ old('description') }}</textarea>
                @error('description')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Link URL (Optional)</label>
                <input type="url" name="link_url" value="{{ old('link_url') }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                       placeholder="https://example.com">
                <p class="text-gray-500 text-xs mt-1">URL to redirect when banner is clicked</p>
                @error('link_url')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Image <span class="text-red-500">*</span></label>
                <input type="file" name="image" accept="image/jpeg,image/png,image/jpg,image/gif" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <p class="text-gray-500 text-xs mt-1">Upload a banner image (max 2MB)</p>
                @error('image')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Display Order</label>
                <input type="number" name="order" value="{{ old('order', 0) }}" min="0"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <p class="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
                @error('order')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="flex items-center mt-8">
                <label class="flex items-center">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', true) ? 'checked' : '' }} class="mr-2">
                    <span class="text-gray-700 text-sm font-bold">Active</span>
                </label>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Banner
            </button>
            <a href="{{ route('admin.banners.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection
