@extends('admin.layouts.app')

@section('title', 'Create User')
@section('page-title', 'Create New User')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.users.store') }}">
        @csrf
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" name="name" value="{{ old('name') }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('name')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('email')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input type="password" name="password" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('password')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Role</label>
                <select name="role" required class="shadow border rounded w-full py-2 px-3">
                    @foreach($roles as $role)
                        <option value="{{ $role->id }}" {{ old('role') == $role->id ? 'selected' : '' }}>
                            {{ $role->name }}
                        </option>
                    @endforeach
                </select>
                @error('role')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">User Type</label>
                <select name="user_type" required class="shadow border rounded w-full py-2 px-3">
                    <option value="simple" {{ old('user_type', 'simple') == 'simple' ? 'selected' : '' }}>Simple User</option>
                    <option value="premium" {{ old('user_type') == 'premium' ? 'selected' : '' }}>Premium User</option>
                </select>
                @error('user_type')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create User
            </button>
            <a href="{{ route('admin.users.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection

