@extends('admin.layouts.app')

@section('title', 'Programs')
@section('page-title', 'Programs Management')

@section('content')
<div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold">All Programs</h3>
    </div>

    <div class="p-6">
        <form method="GET" action="{{ route('admin.programs.index') }}" class="mb-4">
            <div class="flex gap-4">
                <input type="text" name="search" value="{{ request('search') }}" 
                       placeholder="Search programs..." 
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <select name="goal" class="shadow border rounded py-2 px-3">
                    <option value="">All Goals</option>
                    <option value="fat_loss" {{ request('goal') == 'fat_loss' ? 'selected' : '' }}>Fat Loss</option>
                    <option value="muscle_gain" {{ request('goal') == 'muscle_gain' ? 'selected' : '' }}>Muscle Gain</option>
                    <option value="maintenance" {{ request('goal') == 'maintenance' ? 'selected' : '' }}>Maintenance</option>
                </select>
                <button type="submit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-search"></i> Filter
                </button>
            </div>
        </form>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coach</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Public</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($programs as $program)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">{{ $program->title }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ $program->coach->name ?? 'N/A' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                    {{ ucfirst(str_replace('_', ' ', $program->goal)) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ ucfirst($program->level) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ $program->duration_weeks }} weeks</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($program->is_public)
                                    <span class="text-green-600"><i class="fas fa-check"></i></span>
                                @else
                                    <span class="text-red-600"><i class="fas fa-times"></i></span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="{{ route('admin.programs.show', $program) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-eye"></i> View
                                </a>
                                <form action="{{ route('admin.programs.destroy', $program) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure?')">
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
                            <td colspan="7" class="px-6 py-4 text-center text-gray-500">No programs found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="mt-4">
            {{ $programs->links() }}
        </div>
    </div>
</div>
@endsection

