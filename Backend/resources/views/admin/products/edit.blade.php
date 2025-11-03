@extends('admin.layouts.app')

@section('title', 'Edit Product')
@section('page-title', 'Edit Product: ' . $product->name)

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.products.update', $product) }}">
        @csrf
        @method('PUT')
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Slug</label>
                <input type="text" name="slug" value="{{ old('slug', $product->slug) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('slug')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" name="name" value="{{ old('name', $product->name) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('name')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea name="description" rows="3"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">{{ old('description', $product->description) }}</textarea>
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Price (cents)</label>
                <input type="number" name="price_cents" value="{{ old('price_cents', $product->price_cents) }}" required min="0"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('price_cents')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Interval</label>
                <select name="interval" required class="shadow border rounded w-full py-2 px-3">
                    <option value="one_time" {{ old('interval', $product->interval) == 'one_time' ? 'selected' : '' }}>One Time</option>
                    <option value="monthly" {{ old('interval', $product->interval) == 'monthly' ? 'selected' : '' }}>Monthly</option>
                    <option value="quarterly" {{ old('interval', $product->interval) == 'quarterly' ? 'selected' : '' }}>Quarterly</option>
                    <option value="semiannual" {{ old('interval', $product->interval) == 'semiannual' ? 'selected' : '' }}>Semi-annual</option>
                    <option value="annual" {{ old('interval', $product->interval) == 'annual' ? 'selected' : '' }}>Annual</option>
                </select>
            </div>

            <div class="md:col-span-2">
                <label class="flex items-center">
                    <input type="checkbox" name="active" value="1" {{ old('active', $product->active) ? 'checked' : '' }} class="mr-2">
                    <span class="text-gray-700 text-sm font-bold">Active</span>
                </label>
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update Product
            </button>
            <a href="{{ route('admin.products.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection

