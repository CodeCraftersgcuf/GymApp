@extends('admin.layouts.app')

@section('title', 'Edit Achievement')
@section('page-title', 'Edit Achievement: ' . $achievement->user_name)

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.achievements.update', $achievement) }}" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">User Name</label>
                <input type="text" name="user_name" value="{{ old('user_name', $achievement->user_name) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                       placeholder="Enter user's name">
                @error('user_name')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                <textarea name="bio" rows="4"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                          placeholder="Enter user's bio or achievement description">{{ old('bio', $achievement->bio) }}</textarea>
                @error('bio')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Current Profile Picture</label>
                @if($achievement->getFirstMediaUrl('profile_pictures'))
                    <img src="{{ $achievement->getFirstMediaUrl('profile_pictures') }}" alt="{{ $achievement->user_name }}" 
                         class="h-32 w-32 object-cover rounded-full mb-2">
                @else
                    <p class="text-gray-400">No image uploaded</p>
                @endif
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Update Profile Picture (Optional)</label>
                <input type="file" name="profile_picture" accept="image/jpeg,image/png,image/jpg,image/gif"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <p class="text-gray-500 text-xs mt-1">Leave empty to keep current image (max 2MB)</p>
                @error('profile_picture')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Display Order</label>
                <input type="number" name="order" value="{{ old('order', $achievement->order) }}" min="0"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <p class="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
                @error('order')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="flex items-center mt-8">
                <label class="flex items-center">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', $achievement->is_active) ? 'checked' : '' }} class="mr-2">
                    <span class="text-gray-700 text-sm font-bold">Active</span>
                </label>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update Achievement
            </button>
            <a href="{{ route('admin.achievements.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection
