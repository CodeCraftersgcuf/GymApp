@extends('admin.layouts.app')

@section('title', 'Plans')
@section('page-title', 'Plans Management')

@section('content')
<div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">All Plans</h3>
            <a href="{{ route('admin.plans.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-plus mr-2"></i>Add Plan
            </a>
        </div>
    </div>

    <div class="p-6">
        <form method="GET" action="{{ route('admin.plans.index') }}" class="mb-4 flex gap-2">
            <input type="text" name="search" value="{{ request('search') }}" 
                   placeholder="Search plans..." 
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            <select name="category" class="shadow border rounded py-2 px-3">
                <option value="">All Categories</option>
                <option value="weight_loss" {{ request('category') == 'weight_loss' ? 'selected' : '' }}>Weight Loss</option>
                <option value="muscle_gain" {{ request('category') == 'muscle_gain' ? 'selected' : '' }}>Muscle Gain</option>
                <option value="endurance" {{ request('category') == 'endurance' ? 'selected' : '' }}>Endurance</option>
                <option value="flexibility" {{ request('category') == 'flexibility' ? 'selected' : '' }}>Flexibility</option>
                <option value="strength" {{ request('category') == 'strength' ? 'selected' : '' }}>Strength</option>
                <option value="general" {{ request('category') == 'general' ? 'selected' : '' }}>General</option>
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Videos</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($plans as $plan)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">{{ $plan->title }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                    {{ ucfirst(str_replace('_', ' ', $plan->category)) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ ucfirst($plan->difficulty) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ $plan->videos_count ?? 0 }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($plan->is_active)
                                    <span class="text-green-600"><i class="fas fa-check"></i></span>
                                @else
                                    <span class="text-red-600"><i class="fas fa-times"></i></span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="{{ route('admin.plans.show', $plan) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-eye"></i> View
                                </a>
                                <a href="{{ route('admin.plans.edit', $plan) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <form action="{{ route('admin.plans.destroy', $plan) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure?')">
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
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No plans found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="mt-4">
            {{ $plans->links() }}
        </div>
    </div>
</div>
@endsection

