@extends('admin.layouts.app')

@section('title', 'Create Exercise')
@section('page-title', 'Create New Exercise')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.exercises.store') }}">
        @csrf
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input type="text" name="title" value="{{ old('title') }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('title')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Equipment</label>
                <select name="equipment" required class="shadow border rounded w-full py-2 px-3">
                    <option value="bodyweight" {{ old('equipment') == 'bodyweight' ? 'selected' : '' }}>Bodyweight</option>
                    <option value="dumbbells" {{ old('equipment') == 'dumbbells' ? 'selected' : '' }}>Dumbbells</option>
                    <option value="barbell" {{ old('equipment') == 'barbell' ? 'selected' : '' }}>Barbell</option>
                    <option value="kettlebell" {{ old('equipment') == 'kettlebell' ? 'selected' : '' }}>Kettlebell</option>
                    <option value="machine" {{ old('equipment') == 'machine' ? 'selected' : '' }}>Machine</option>
                    <option value="cables" {{ old('equipment') == 'cables' ? 'selected' : '' }}>Cables</option>
                    <option value="resistance_bands" {{ old('equipment') == 'resistance_bands' ? 'selected' : '' }}>Resistance Bands</option>
                    <option value="other" {{ old('equipment') == 'other' ? 'selected' : '' }}>Other</option>
                </select>
                @error('equipment')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Primary Muscle</label>
                <select name="primary_muscle" required class="shadow border rounded w-full py-2 px-3">
                    <option value="chest" {{ old('primary_muscle') == 'chest' ? 'selected' : '' }}>Chest</option>
                    <option value="back" {{ old('primary_muscle') == 'back' ? 'selected' : '' }}>Back</option>
                    <option value="shoulders" {{ old('primary_muscle') == 'shoulders' ? 'selected' : '' }}>Shoulders</option>
                    <option value="arms" {{ old('primary_muscle') == 'arms' ? 'selected' : '' }}>Arms</option>
                    <option value="legs" {{ old('primary_muscle') == 'legs' ? 'selected' : '' }}>Legs</option>
                    <option value="core" {{ old('primary_muscle') == 'core' ? 'selected' : '' }}>Core</option>
                    <option value="cardio" {{ old('primary_muscle') == 'cardio' ? 'selected' : '' }}>Cardio</option>
                    <option value="full_body" {{ old('primary_muscle') == 'full_body' ? 'selected' : '' }}>Full Body</option>
                </select>
                @error('primary_muscle')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Difficulty</label>
                <select name="difficulty" required class="shadow border rounded w-full py-2 px-3">
                    <option value="beginner" {{ old('difficulty') == 'beginner' ? 'selected' : '' }}>Beginner</option>
                    <option value="intermediate" {{ old('difficulty') == 'intermediate' ? 'selected' : '' }}>Intermediate</option>
                    <option value="advanced" {{ old('difficulty') == 'advanced' ? 'selected' : '' }}>Advanced</option>
                </select>
                @error('difficulty')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Video URL (YouTube)</label>
                <input type="url" name="video_url" value="{{ old('video_url') }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                       placeholder="https://www.youtube.com/watch?v=...">
                @error('video_url')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea name="description" rows="3"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">{{ old('description') }}</textarea>
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Instructions</label>
                <textarea name="instructions" rows="5"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">{{ old('instructions') }}</textarea>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Exercise
            </button>
            <a href="{{ route('admin.exercises.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection

