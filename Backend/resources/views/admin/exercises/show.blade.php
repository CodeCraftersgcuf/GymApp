@extends('admin.layouts.app')

@section('title', 'Exercise Details')
@section('page-title', 'Exercise: ' . $exercise->title)

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-start mb-4">
        <div>
            <h3 class="text-2xl font-bold">{{ $exercise->title }}</h3>
        </div>
        <div class="flex gap-2">
            <a href="{{ route('admin.exercises.edit', $exercise) }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-edit mr-2"></i>Edit
            </a>
            <form action="{{ route('admin.exercises.destroy', $exercise) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                @csrf
                @method('DELETE')
                <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-trash mr-2"></i>Delete
                </button>
            </form>
        </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
            <span class="text-gray-500 text-sm">Equipment</span>
            <p class="font-semibold">{{ ucfirst($exercise->equipment) }}</p>
        </div>
        <div>
            <span class="text-gray-500 text-sm">Primary Muscle</span>
            <p class="font-semibold">{{ ucfirst($exercise->primary_muscle) }}</p>
        </div>
        <div>
            <span class="text-gray-500 text-sm">Difficulty</span>
            <p class="font-semibold">{{ ucfirst($exercise->difficulty) }}</p>
        </div>
        <div>
            <span class="text-gray-500 text-sm">Video</span>
            <p class="font-semibold">
                @if($exercise->video_url)
                    <a href="{{ $exercise->video_url }}" target="_blank" class="text-blue-600 hover:underline">
                        <i class="fas fa-video"></i> View Video
                    </a>
                @else
                    <span class="text-gray-400">No video</span>
                @endif
            </p>
        </div>
    </div>

    @if($exercise->description)
        <div class="mb-4">
            <h4 class="font-semibold mb-2">Description</h4>
            <p class="text-gray-700">{{ $exercise->description }}</p>
        </div>
    @endif

    @if($exercise->instructions)
        <div>
            <h4 class="font-semibold mb-2">Instructions</h4>
            <p class="text-gray-700 whitespace-pre-line">{{ $exercise->instructions }}</p>
        </div>
    @endif
</div>
@endsection

