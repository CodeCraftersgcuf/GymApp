@extends('admin.layouts.app')

@section('title', 'Create Package')
@section('page-title', 'Create New Package')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.packages.store') }}">
        @csrf
        <div class="space-y-6">
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Title (e.g., Option 1, Option 2)</label>
                <input type="text" name="title" value="{{ old('title') }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('title')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Bank Name</label>
                    <input type="text" name="bank_name" value="{{ old('bank_name') }}" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                    @error('bank_name')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
                </div>

                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Account Title</label>
                    <input type="text" name="account_title" value="{{ old('account_title') }}" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                    @error('account_title')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
                </div>
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Account Number</label>
                <input type="text" name="account_number" value="{{ old('account_number') }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('account_number')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">WhatsApp Number (for receipt)</label>
                <input type="text" name="whatsapp_number" value="{{ old('whatsapp_number') }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                       placeholder="e.g., +923001234567">
                <p class="text-gray-500 text-xs mt-1">Users will send receipt screenshot to this number</p>
                @error('whatsapp_number')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Description/Instructions</label>
                <textarea name="description" rows="3"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">{{ old('description') }}</textarea>
                @error('description')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Display Order</label>
                    <input type="number" name="order" value="{{ old('order', 0) }}" min="0"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                    <p class="text-gray-500 text-xs mt-1">Lower numbers appear first</p>
                    @error('order')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
                </div>

                <div>
                    <label class="flex items-center mt-8">
                        <input type="checkbox" name="is_active" value="1" {{ old('is_active', true) ? 'checked' : '' }} class="mr-2">
                        <span class="text-gray-700 text-sm font-bold">Active</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Package
            </button>
            <a href="{{ route('admin.packages.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection
