@extends('admin.layouts.app')

@section('title', 'Achievement Details')
@section('page-title', 'Achievement: ' . $achievement->user_name)

@section('content')
<div class="space-y-6">
    <!-- Achievement Details -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-4">
            <div class="flex gap-4">
                @if($achievement->getFirstMediaUrl('profile_pictures'))
                    <img src="{{ $achievement->getFirstMediaUrl('profile_pictures') }}" alt="{{ $achievement->user_name }}" 
                         class="h-32 w-32 object-cover rounded-full">
                @endif
                <div>
                    <h3 class="text-2xl font-bold">{{ $achievement->user_name }}</h3>
                    <p class="text-gray-600 mt-2">{{ $achievement->bio }}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <a href="{{ route('admin.achievements.edit', $achievement) }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-edit mr-2"></i>Edit Achievement
                </a>
                <form action="{{ route('admin.achievements.destroy', $achievement) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        <i class="fas fa-trash mr-2"></i>Delete
                    </button>
                </form>
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div>
                <span class="text-gray-500 text-sm">Order</span>
                <p class="font-semibold">{{ $achievement->order }}</p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Status</span>
                <p class="font-semibold">{{ $achievement->is_active ? 'Active' : 'Inactive' }}</p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Videos Count</span>
                <p class="font-semibold">{{ $achievement->videos->count() }}</p>
            </div>
        </div>
    </div>

    <!-- Videos Section -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">YouTube Videos ({{ $achievement->videos->count() }})</h3>
            <button onclick="openAddModal()" 
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-plus mr-2"></i>Add Video
            </button>
        </div>

        @if($achievement->videos->count() > 0)
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">YouTube URL</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($achievement->videos->sortBy('order') as $video)
                            <tr>
                                <td class="px-6 py-4">
                                    <a href="{{ $video->youtube_url }}" target="_blank" class="text-blue-600 hover:underline">
                                        {{ Str::limit($video->youtube_url, 60) }}
                                    </a>
                                </td>
                                <td class="px-6 py-4">{{ $video->order }}</td>
                                <td class="px-6 py-4 text-sm font-medium">
                                    <button onclick="editVideo({{ $video->id }}, '{{ $video->youtube_url }}', {{ $video->order }})" 
                                            class="text-blue-600 hover:text-blue-900 mr-3">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <form action="{{ route('admin.achievements.videos.destroy', ['achievement' => $achievement, 'video' => $video]) }}" 
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
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Add Video</h3>
        <form method="POST" action="{{ route('admin.achievements.videos.store', $achievement) }}" id="addVideoForm">
            @csrf
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">YouTube URL <span class="text-red-500">*</span></label>
                    <input type="url" name="youtube_url" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                           placeholder="https://www.youtube.com/watch?v=...">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Order</label>
                    <input type="number" name="order" value="0" min="0"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                    <p class="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
                </div>
            </div>
            <div class="mt-6 flex gap-2">
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1">
                    Add Video
                </button>
                <button type="button" onclick="closeAddModal()" 
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Video Modal -->
<div id="editVideoModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Edit Video</h3>
        <form method="POST" id="editVideoForm" action="">
            @csrf
            @method('PUT')
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">YouTube URL <span class="text-red-500">*</span></label>
                    <input type="url" name="youtube_url" id="edit_youtube_url" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                           placeholder="https://www.youtube.com/watch?v=...">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Order</label>
                    <input type="number" name="order" id="edit_order" value="0" min="0"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                    <p class="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
                </div>
            </div>
            <div class="mt-6 flex gap-2">
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1">
                    Update Video
                </button>
                <button type="button" onclick="closeEditModal()" 
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
function openAddModal() {
    document.getElementById('addVideoModal').classList.remove('hidden');
    document.getElementById('addVideoForm').reset();
}

function closeAddModal() {
    document.getElementById('addVideoModal').classList.add('hidden');
}

function editVideo(videoId, youtubeUrl, order) {
    document.getElementById('editVideoForm').action = '{{ route("admin.achievements.videos.update", ["achievement" => $achievement, "video" => ":video"]) }}'.replace(':video', videoId);
    document.getElementById('edit_youtube_url').value = youtubeUrl;
    document.getElementById('edit_order').value = order;
    document.getElementById('editVideoModal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('editVideoModal').classList.add('hidden');
}

// Close modals when clicking outside
window.onclick = function(event) {
    const addModal = document.getElementById('addVideoModal');
    const editModal = document.getElementById('editVideoModal');
    if (event.target == addModal) {
        closeAddModal();
    }
    if (event.target == editModal) {
        closeEditModal();
    }
}
</script>
@endpush
@endsection
