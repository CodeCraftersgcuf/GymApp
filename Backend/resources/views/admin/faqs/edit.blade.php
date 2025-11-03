@extends('admin.layouts.app')

@section('title', 'Edit FAQ')
@section('page-title', 'Edit FAQ')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.faqs.update', $faq) }}">
        @csrf
        @method('PUT')
        <div class="space-y-6">
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Question</label>
                <input type="text" name="question" value="{{ old('question', $faq->question) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('question')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Answer</label>
                <textarea name="answer" rows="5" required
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">{{ old('answer', $faq->answer) }}</textarea>
                @error('answer')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Category</label>
                    <input type="text" name="category" value="{{ old('category', $faq->category) }}"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                           placeholder="e.g., General, Payment, Account">
                    @error('category')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
                </div>

                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Order</label>
                    <input type="number" name="order" value="{{ old('order', $faq->order) }}" min="0"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                    @error('order')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
                </div>
            </div>

            <div>
                <label class="flex items-center">
                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', $faq->is_active) ? 'checked' : '' }} class="mr-2">
                    <span class="text-gray-700 text-sm font-bold">Active</span>
                </label>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update FAQ
            </button>
            <a href="{{ route('admin.faqs.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection

