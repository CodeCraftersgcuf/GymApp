@extends('admin.layouts.app')

@section('title', 'Create Achievement')
@section('page-title', 'Create New Achievement')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.achievements.store') }}" enctype="multipart/form-data">
        @csrf
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">User Name <span class="text-red-500">*</span></label>
                <input type="text" name="user_name" value="{{ old('user_name') }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                       placeholder="Enter user's name">
                @error('user_name')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                <textarea name="bio" rows="4"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                          placeholder="Enter user's bio or achievement description">{{ old('bio') }}</textarea>
                @error('bio')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Profile Picture <span class="text-red-500">*</span></label>
                <input type="file" name="profile_picture" accept="image/jpeg,image/png,image/jpg,image/gif" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <p class="text-gray-500 text-xs mt-1">Upload a profile picture (max 2MB)</p>
                @error('profile_picture')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
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
                Create Achievement
            </button>
            <a href="{{ route('admin.achievements.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection
