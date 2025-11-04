@extends('admin.layouts.app')

@section('title', 'Reviews')
@section('page-title', 'Reviews Management')

@section('content')
<div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">All Reviews</h3>
            <a href="{{ route('admin.reviews.create') }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-plus mr-2"></i>Add Review
            </a>
        </div>
    </div>

    <div class="p-6">
        <form method="GET" action="{{ route('admin.reviews.index') }}" class="mb-4 flex gap-2">
            <input type="text" name="search" value="{{ request('search') }}" 
                   placeholder="Search reviews..." 
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            <select name="is_active" class="shadow border rounded py-2 px-3">
                <option value="">All Status</option>
                <option value="1" {{ request('is_active') == '1' ? 'selected' : '' }}>Active</option>
                <option value="0" {{ request('is_active') == '0' ? 'selected' : '' }}>Inactive</option>
            </select>
            <button type="submit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-search"></i>
            </button>
        </form>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Video Link</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($reviews as $review)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($review->getFirstMediaUrl('images'))
                                    <img src="{{ $review->getFirstMediaUrl('images') }}" alt="Review" 
                                         class="h-16 w-16 object-cover rounded">
                                @else
                                    <span class="text-gray-400">No image</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                {{ Str::limit($review->description ?? 'N/A', 50) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($review->video_link)
                                    <a href="{{ $review->video_link }}" target="_blank" class="text-blue-600 hover:underline">
                                        {{ Str::limit($review->video_link, 30) }}
                                    </a>
                                @else
                                    <span class="text-gray-400">-</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ $review->order }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($review->is_active)
                                    <span class="text-green-600"><i class="fas fa-check"></i></span>
                                @else
                                    <span class="text-red-600"><i class="fas fa-times"></i></span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="{{ route('admin.reviews.show', $review) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-eye"></i> View
                                </a>
                                <a href="{{ route('admin.reviews.edit', $review) }}" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <form action="{{ route('admin.reviews.destroy', $review) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure?')">
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
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No reviews found</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="mt-4">
            {{ $reviews->links() }}
        </div>
    </div>
</div>
@endsection
