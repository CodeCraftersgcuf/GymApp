@extends('admin.layouts.app')

@section('title', 'Edit Plan')
@section('page-title', 'Edit Plan: ' . $plan->title)

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.plans.update', $plan) }}">
        @csrf
        @method('PUT')
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input type="text" name="title" value="{{ old('title', $plan->title) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('title')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea name="description" rows="3"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">{{ old('description', $plan->description) }}</textarea>
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                <input type="url" name="image_url" value="{{ old('image_url', $plan->image_url) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('image_url')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Category</label>
                <select name="category" required class="shadow border rounded w-full py-2 px-3">
                    <option value="weight_loss" {{ old('category', $plan->category) == 'weight_loss' ? 'selected' : '' }}>Weight Loss</option>
                    <option value="muscle_gain" {{ old('category', $plan->category) == 'muscle_gain' ? 'selected' : '' }}>Muscle Gain</option>
                    <option value="endurance" {{ old('category', $plan->category) == 'endurance' ? 'selected' : '' }}>Endurance</option>
                    <option value="flexibility" {{ old('category', $plan->category) == 'flexibility' ? 'selected' : '' }}>Flexibility</option>
                    <option value="strength" {{ old('category', $plan->category) == 'strength' ? 'selected' : '' }}>Strength</option>
                    <option value="general" {{ old('category', $plan->category) == 'general' ? 'selected' : '' }}>General</option>
                </select>
                @error('category')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Difficulty</label>
                <select name="difficulty" required class="shadow border rounded w-full py-2 px-3">
                    <option value="beginner" {{ old('difficulty', $plan->difficulty) == 'beginner' ? 'selected' : '' }}>Beginner</option>
                    <option value="intermediate" {{ old('difficulty', $plan->difficulty) == 'intermediate' ? 'selected' : '' }}>Intermediate</option>
                    <option value="advanced" {{ old('difficulty', $plan->difficulty) == 'advanced' ? 'selected' : '' }}>Advanced</option>
                </select>
                @error('difficulty')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Duration (weeks)</label>
                <input type="number" name="duration_weeks" value="{{ old('duration_weeks', $plan->duration_weeks) }}" min="1"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('duration_weeks')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Order</label>
                <input type="number" name="order" value="{{ old('order', $plan->order) }}" min="0"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('order')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="flex items-center">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', $plan->is_active) ? 'checked' : '' }} class="mr-2">
                    <span class="text-gray-700 text-sm font-bold">Active</span>
                </label>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update Plan
            </button>
            <a href="{{ route('admin.plans.show', $plan) }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection

