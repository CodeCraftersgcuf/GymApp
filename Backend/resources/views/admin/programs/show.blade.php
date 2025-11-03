@extends('admin.layouts.app')

@section('title', 'Program Details')
@section('page-title', 'Program: ' . $program->title)

@section('content')
<div class="bg-white rounded-lg shadow p-6 mb-6">
    <h3 class="text-xl font-semibold mb-4">Program Information</h3>
    <div class="grid grid-cols-2 gap-4">
        <div>
            <p class="text-gray-600">Title</p>
            <p class="font-semibold">{{ $program->title }}</p>
        </div>
        <div>
            <p class="text-gray-600">Coach</p>
            <p class="font-semibold">{{ $program->coach->name ?? 'N/A' }}</p>
        </div>
        <div>
            <p class="text-gray-600">Goal</p>
            <p class="font-semibold">{{ ucfirst(str_replace('_', ' ', $program->goal)) }}</p>
        </div>
        <div>
            <p class="text-gray-600">Level</p>
            <p class="font-semibold">{{ ucfirst($program->level) }}</p>
        </div>
        <div>
            <p class="text-gray-600">Duration</p>
            <p class="font-semibold">{{ $program->duration_weeks }} weeks</p>
        </div>
        <div>
            <p class="text-gray-600">Price</p>
            <p class="font-semibold">${{ number_format($program->price_cents / 100, 2) }}</p>
        </div>
    </div>
</div>

<div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-xl font-semibold mb-4">Phases & Workouts</h3>
    @foreach($program->phases as $phase)
        <div class="mb-6 border-b pb-4">
            <h4 class="text-lg font-semibold mb-2">{{ $phase->title }}</h4>
            @foreach($phase->workouts as $workout)
                <div class="ml-4 mb-3 p-3 bg-gray-50 rounded">
                    <p class="font-medium">{{ $workout->title }}</p>
                    <p class="text-sm text-gray-600">Day: {{ ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][$workout->day_of_week] }}</p>
                    @if($workout->exercises->count() > 0)
                        <ul class="mt-2 text-sm">
                            @foreach($workout->exercises as $exercise)
                                <li class="ml-4">• {{ $exercise->title }} ({{ $exercise->pivot->sets }} sets)</li>
                            @endforeach
                        </ul>
                    @endif
                </div>
            @endforeach
        </div>
    @endforeach
</div>
@endsection

