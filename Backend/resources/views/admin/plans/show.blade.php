@extends('admin.layouts.app')

@section('title', 'Plan Details')
@section('page-title', 'Plan: ' . $plan->title)

@section('content')
<div class="space-y-6">
    <!-- Plan Details -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="text-2xl font-bold">{{ $plan->title }}</h3>
                <p class="text-gray-600 mt-2">{{ $plan->description }}</p>
            </div>
            <div class="flex gap-2">
                <a href="{{ route('admin.plans.edit', $plan) }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-edit mr-2"></i>Edit Plan
                </a>
                <form action="{{ route('admin.plans.destroy', $plan) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        <i class="fas fa-trash mr-2"></i>Delete
                    </button>
                </form>
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
                <span class="text-gray-500 text-sm">Category</span>
                <p class="font-semibold">{{ ucfirst(str_replace('_', ' ', $plan->category)) }}</p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Difficulty</span>
                <p class="font-semibold">{{ ucfirst($plan->difficulty) }}</p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Duration</span>
                <p class="font-semibold">{{ $plan->duration_weeks ?? 'N/A' }} weeks</p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Status</span>
                <p class="font-semibold">{{ $plan->is_active ? 'Active' : 'Inactive' }}</p>
            </div>
        </div>
    </div>

    <!-- Videos Section -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Videos ({{ $plan->videos->count() }})</h3>
            <button onclick="document.getElementById('addVideoModal').classList.remove('hidden')" 
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-plus mr-2"></i>Add Video
            </button>
        </div>

        @if($plan->videos->count() > 0)
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">YouTube URL</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($plan->videos->sortBy('order') as $video)
                            <tr>
                                <td class="px-6 py-4">{{ $video->title }}</td>
                                <td class="px-6 py-4">
                                    <a href="{{ $video->youtube_url }}" target="_blank" class="text-blue-600 hover:underline">
                                        {{ Str::limit($video->youtube_url, 40) }}
                                    </a>
                                </td>
                                <td class="px-6 py-4">{{ $video->duration_seconds ? gmdate('i:s', $video->duration_seconds) : 'N/A' }}</td>
                                <td class="px-6 py-4">{{ $video->order }}</td>
                                <td class="px-6 py-4 text-sm font-medium">
                                    <button onclick="editVideo({{ $video->id }})" class="text-blue-600 hover:text-blue-900 mr-3">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <form action="{{ route('admin.plans.videos.destroy', ['plan' => $plan, 'video' => $video]) }}" 
                                          method="POST" class="inline" onsubmit="return confirm('Are you sure?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-red-600 hover:text-red-900">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <p class="text-gray-500 text-center py-8">No videos added yet. Click "Add Video" to get started.</p>
        @endif
    </div>
</div>

<!-- Add Video Modal -->
<div id="addVideoModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Add Video</h3>
        <form method="POST" action="{{ route('admin.plans.videos.store', $plan) }}">
            @csrf
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                    <input type="text" name="title" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea name="description" rows="3"
                              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">YouTube URL</label>
                    <input type="url" name="youtube_url" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                           placeholder="https://www.youtube.com/watch?v=...">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Thumbnail URL</label>
                    <input type="url" name="thumbnail_url"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Duration (seconds)</label>
                    <input type="number" name="duration_seconds" min="0"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Order</label>
                    <input type="number" name="order" value="0" min="0"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                </div>
            </div>
            <div class="mt-6 flex gap-2">
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1">
                    Add Video
                </button>
                <button type="button" onclick="document.getElementById('addVideoModal').classList.add('hidden')" 
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
function editVideo(videoId) {
    // Implement edit functionality if needed
    alert('Edit functionality can be added here');
}
</script>
@endpush
@endsection

