@extends('admin.layouts.app')

@section('title', 'Edit Social Media Link')
@section('page-title', 'Edit Social Media Link')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.communities.update', $community) }}">
        @csrf
        @method('PUT')
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Platform <span class="text-red-500">*</span></label>
                <input type="text" name="platform" value="{{ old('platform', $community->platform) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                       placeholder="e.g., Facebook, Instagram, Twitter, LinkedIn">
                <p class="text-gray-500 text-xs mt-1">Enter the name of the social media platform</p>
                @error('platform')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">URL <span class="text-red-500">*</span></label>
                <input type="url" name="url" value="{{ old('url', $community->url) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                       placeholder="https://www.facebook.com/yourpage or https://www.instagram.com/yourpage">
                <p class="text-gray-500 text-xs mt-1">Enter the full URL to your social media page</p>
                @error('url')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Display Order</label>
                <input type="number" name="order" value="{{ old('order', $community->order) }}" min="0"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <p class="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
                @error('order')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="flex items-center mt-8">
                <label class="flex items-center">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', $community->is_active) ? 'checked' : '' }} class="mr-2">
                    <span class="text-gray-700 text-sm font-bold">Active</span>
                </label>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update Social Media Link
            </button>
            <a href="{{ route('admin.communities.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection
