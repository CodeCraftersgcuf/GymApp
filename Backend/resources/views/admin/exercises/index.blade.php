@extends('admin.layouts.app')

@section('title', 'Exercises')
@section('page-title', 'Exercises Management')

@section('content')
<div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">All Exercises</h3>
            <a href="{{ route('admin.exercises.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-plus mr-2"></i>Add Exercise
            </a>
        </div>
    </div>

    <div class="p-6">
        <form method="GET" action="{{ route('admin.exercises.index') }}" class="mb-4 flex gap-2 flex-wrap">
            <input type="text" name="search" value="{{ request('search') }}" 
                   placeholder="Search exercises..." 
                   class="shadow appearance-none border rounded py-2 px-3 text-gray-700 flex-1 min-w-[200px]">
            <select name="equipment" class="shadow border rounded py-2 px-3">
                <option value="">All Equipment</option>
                <option value="bodyweight" {{ request('equipment') == 'bodyweight' ? 'selected' : '' }}>Bodyweight</option>
                <option value="dumbbells" {{ request('equipment') == 'dumbbells' ? 'selected' : '' }}>Dumbbells</option>
                <option value="barbell" {{ request('equipment') == 'barbell' ? 'selected' : '' }}>Barbell</option>
                <option value="kettlebell" {{ request('equipment') == 'kettlebell' ? 'selected' : '' }}>Kettlebell</option>
                <option value="machine" {{ request('equipment') == 'machine' ? 'selected' : '' }}>Machine</option>
            </select>
            <select name="primary_muscle" class="shadow border rounded py-2 px-3">
                <option value="">All Muscles</option>
                <option value="chest" {{ request('primary_muscle') == 'chest' ? 'selected' : '' }}>Chest</option>
                <option value="back" {{ request('primary_muscle') == 'back' ? 'selected' : '' }}>Back</option>
                <option value="shoulders" {{ request('primary_muscle') == 'shoulders' ? 'selected' : '' }}>Shoulders</option>
                <option value="arms" {{ request('primary_muscle') == 'arms' ? 'selected' : '' }}>Arms</option>
                <option value="legs" {{ request('primary_muscle') == 'legs' ? 'selected' : '' }}>Legs</option>
                <option value="core" {{ request('primary_muscle') == 'core' ? 'selected' : '' }}>Core</option>
            </select>
            <select name="difficulty" class="shadow border rounded py-2 px-3">
                <option value="">All Levels</option>
                <option value="beginner" {{ request('difficulty') == 'beginner' ? 'selected' : '' }}>Beginner</option>
                <option value="intermediate" {{ request('difficulty') == 'intermediate' ? 'selected' : '' }}>Intermediate</option>
                <option value="advanced" {{ request('difficulty') == 'advanced' ? 'selected' : '' }}>Advanced</option>
            </select>
            <button type="submit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-search"></i>
            </button>
        </form>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Muscle</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Video</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($exercises as $exercise)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">{{ $exercise->title }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ ucfirst($exercise->equipment) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ ucfirst($exercise->primary_muscle) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                    {{ ucfirst($exercise->difficulty) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($exercise->video_url)
                                    <a href="{{ $exercise->video_url }}" target="_blank" class="text-blue-600">
                                        <i class="fas fa-video"></i>
                                    </a>
                                @else
                                    <span class="text-gray-400">-</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="{{ route('admin.exercises.show', $exercise) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-eye"></i> View
                                </a>
                                <a href="{{ route('admin.exercises.edit', $exercise) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <form action="{{ route('admin.exercises.destroy', $exercise) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-600 hover:text-red-900">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No exercises found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="mt-4">
            {{ $exercises->links() }}
        </div>
    </div>
</div>
@endsection

