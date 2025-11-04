@extends('admin.layouts.app')

@section('title', 'Video Library Details')
@section('page-title', 'Video Library: ' . $videoLibrary->title)

@section('content')
<div class="space-y-6">
    <!-- Video Library Details -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start mb-4">
            <div class="flex gap-4">
                @if($videoLibrary->getFirstMediaUrl('images'))
                    <img src="{{ $videoLibrary->getFirstMediaUrl('images') }}" alt="{{ $videoLibrary->title }}" 
                         class="h-32 w-32 object-cover rounded">
                @endif
                <div>
                    <h3 class="text-2xl font-bold">{{ $videoLibrary->title }}</h3>
                    <p class="text-gray-600 mt-2">{{ $videoLibrary->description }}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <a href="{{ route('admin.video-libraries.edit', $videoLibrary) }}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <i class="fas fa-edit mr-2"></i>Edit Library
                </a>
                <form action="{{ route('admin.video-libraries.destroy', $videoLibrary) }}" method="POST" onsubmit="return confirm('Are you sure?')">
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
                <p class="font-semibold">{{ $videoLibrary->order }}</p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Status</span>
                <p class="font-semibold">{{ $videoLibrary->is_active ? 'Active' : 'Inactive' }}</p>
            </div>
            <div>
                <span class="text-gray-500 text-sm">Videos Count</span>
                <p class="font-semibold">{{ $videoLibrary->items->count() }}</p>
            </div>
        </div>
    </div>

    <!-- Video Items Section -->
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Video Items ({{ $videoLibrary->items->count() }})</h3>
            <button onclick="openAddModal()" 
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-plus mr-2"></i>Add Video Item
            </button>
        </div>

        @if($videoLibrary->items->count() > 0)
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">YouTube URL</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        @foreach($videoLibrary->items->sortBy('order') as $item)
                            <tr>
                                <td class="px-6 py-4">{{ $item->title }}</td>
                                <td class="px-6 py-4">
                                    <a href="{{ $item->youtube_url }}" target="_blank" class="text-blue-600 hover:underline">
                                        {{ Str::limit($item->youtube_url, 40) }}
                                    </a>
                                </td>
                                <td class="px-6 py-4">{{ Str::limit($item->description ?? 'N/A', 50) }}</td>
                                <td class="px-6 py-4">{{ $item->order }}</td>
                                <td class="px-6 py-4 text-sm font-medium">
                                    <button onclick="editItem({{ $item->id }}, '{{ $item->title }}', '{{ $item->youtube_url }}', '{{ addslashes($item->description ?? '') }}', '{{ addslashes($item->notes ?? '') }}', {{ $item->order }})" 
                                            class="text-blue-600 hover:text-blue-900 mr-3">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <form action="{{ route('admin.video-libraries.items.destroy', ['videoLibrary' => $videoLibrary, 'item' => $item]) }}" 
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
            <p class="text-gray-500 text-center py-8">No video items added yet. Click "Add Video Item" to get started.</p>
        @endif
    </div>
</div>

<!-- Add Video Item Modal -->
<div id="addItemModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Add Video Item</h3>
        <form method="POST" action="{{ route('admin.video-libraries.items.store', $videoLibrary) }}" id="addItemForm">
            @csrf
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                    <input type="text" name="title" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">YouTube URL</label>
                    <input type="url" name="youtube_url" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                           placeholder="https://www.youtube.com/watch?v=...">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea name="description" rows="3"
                              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Notes</label>
                    <textarea name="notes" rows="3"
                              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Order</label>
                    <input type="number" name="order" value="0" min="0"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                </div>
            </div>
            <div class="mt-6 flex gap-2">
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1">
                    Add Video Item
                </button>
                <button type="button" onclick="closeAddModal()" 
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1">
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Video Item Modal -->
<div id="editItemModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">Edit Video Item</h3>
        <form method="POST" id="editItemForm" action="">
            @csrf
            @method('PUT')
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Title</label>
                    <input type="text" name="title" id="edit_title" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">YouTube URL</label>
                    <input type="url" name="youtube_url" id="edit_youtube_url" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                           placeholder="https://www.youtube.com/watch?v=...">
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea name="description" id="edit_description" rows="3"
                              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Notes</label>
                    <textarea name="notes" id="edit_notes" rows="3"
                              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"></textarea>
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Order</label>
                    <input type="number" name="order" id="edit_order" value="0" min="0"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                </div>
            </div>
            <div class="mt-6 flex gap-2">
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1">
                    Update Video Item
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
    document.getElementById('addItemModal').classList.remove('hidden');
    document.getElementById('addItemForm').reset();
}

function closeAddModal() {
    document.getElementById('addItemModal').classList.add('hidden');
}

function editItem(itemId, title, youtubeUrl, description, notes, order) {
    document.getElementById('editItemForm').action = '{{ route("admin.video-libraries.items.update", ["videoLibrary" => $videoLibrary, "item" => ":item"]) }}'.replace(':item', itemId);
    document.getElementById('edit_title').value = title;
    document.getElementById('edit_youtube_url').value = youtubeUrl;
    document.getElementById('edit_description').value = description;
    document.getElementById('edit_notes').value = notes;
    document.getElementById('edit_order').value = order;
    document.getElementById('editItemModal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('editItemModal').classList.add('hidden');
}

// Close modals when clicking outside
window.onclick = function(event) {
    const addModal = document.getElementById('addItemModal');
    const editModal = document.getElementById('editItemModal');
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
