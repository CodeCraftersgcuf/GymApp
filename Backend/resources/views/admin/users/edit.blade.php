@extends('admin.layouts.app')

@section('title', 'Edit User')
@section('page-title', 'Edit User: ' . $user->name)

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form method="POST" action="{{ route('admin.users.update', $user) }}">
        @csrf
        @method('PUT')
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" name="name" value="{{ old('name', $user->name) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('name')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" name="email" value="{{ old('email', $user->email) }}" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('email')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Password (leave blank to keep current)</label>
                <input type="password" name="password"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                @error('password')<p class="text-red-500 text-xs mt-1">{{ $message }}</p>@enderror
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Role</label>
                <select name="role" required class="shadow border rounded w-full py-2 px-3">
                    @foreach($roles as $role)
                        <option value="{{ $role->id }}" {{ ($user->roles->first()->id ?? null) == $role->id ? 'selected' : '' }}>
                            {{ $role->name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                <input type="text" name="phone" value="{{ old('phone', $user->phone) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                <select name="gender" class="shadow border rounded w-full py-2 px-3">
                    <option value="">Select...</option>
                    <option value="male" {{ old('gender', $user->gender) == 'male' ? 'selected' : '' }}>Male</option>
                    <option value="female" {{ old('gender', $user->gender) == 'female' ? 'selected' : '' }}>Female</option>
                    <option value="other" {{ old('gender', $user->gender) == 'other' ? 'selected' : '' }}>Other</option>
                </select>
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                <input type="date" name="dob" value="{{ old('dob', $user->dob?->format('Y-m-d')) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Goal</label>
                <select name="goal" class="shadow border rounded w-full py-2 px-3">
                    <option value="">Select...</option>
                    <option value="fat_loss" {{ old('goal', $user->goal) == 'fat_loss' ? 'selected' : '' }}>Fat Loss</option>
                    <option value="muscle_gain" {{ old('goal', $user->goal) == 'muscle_gain' ? 'selected' : '' }}>Muscle Gain</option>
                    <option value="maintenance" {{ old('goal', $user->goal) == 'maintenance' ? 'selected' : '' }}>Maintenance</option>
                    <option value="endurance" {{ old('goal', $user->goal) == 'endurance' ? 'selected' : '' }}>Endurance</option>
                    <option value="strength" {{ old('goal', $user->goal) == 'strength' ? 'selected' : '' }}>Strength</option>
                </select>
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Height (cm)</label>
                <input type="number" name="height_cm" value="{{ old('height_cm', $user->height_cm) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            </div>

            <div>
                <label class="block text-gray-700 text-sm font-bold mb-2">Weight (kg)</label>
                <input type="number" step="0.01" name="weight_kg" value="{{ old('weight_kg', $user->weight_kg) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update User
            </button>
            <a href="{{ route('admin.users.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection

