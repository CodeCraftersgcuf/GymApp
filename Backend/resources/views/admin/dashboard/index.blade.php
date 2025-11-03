@extends('admin.layouts.app')

@section('title', 'Dashboard')
@section('page-title', 'Dashboard')

@section('content')
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-gray-600 text-sm">Total Users</p>
                <p class="text-3xl font-bold text-gray-900">{{ number_format($stats['total_users']) }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
                <i class="fas fa-users text-blue-600 text-2xl"></i>
            </div>
        </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-gray-600 text-sm">Active Subscriptions</p>
                <p class="text-3xl font-bold text-gray-900">{{ number_format($stats['active_subscriptions']) }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
                <i class="fas fa-check-circle text-green-600 text-2xl"></i>
            </div>
        </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-gray-600 text-sm">MRR (Monthly)</p>
                <p class="text-3xl font-bold text-gray-900">${{ number_format($stats['mrr'], 2) }}</p>
            </div>
            <div class="bg-yellow-100 p-3 rounded-full">
                <i class="fas fa-dollar-sign text-yellow-600 text-2xl"></i>
            </div>
        </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-gray-600 text-sm">Workouts This Week</p>
                <p class="text-3xl font-bold text-gray-900">{{ number_format($stats['workouts_this_week']) }}</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
                <i class="fas fa-dumbbell text-purple-600 text-2xl"></i>
            </div>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">New Users Per Week</h3>
        <div class="space-y-2">
            @foreach($newUsers as $week)
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Week {{ $week->week }}</span>
                    <div class="flex items-center">
                        <div class="bg-blue-500 h-4 rounded" style="width: {{ ($week->count / max($newUsers->max('count'), 1)) * 200 }}px; margin-right: 8px;"></div>
                        <span class="text-sm font-semibold">{{ $week->count }}</span>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Revenue Per Month</h3>
        <div class="space-y-2">
            @foreach($revenue as $month)
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">{{ date('M Y', strtotime($month->month . '-01')) }}</span>
                    <div class="flex items-center">
                        <div class="bg-green-500 h-4 rounded" style="width: {{ ($month->revenue / max($revenue->max('revenue'), 1)) * 200 }}px; margin-right: 8px;"></div>
                        <span class="text-sm font-semibold">${{ number_format($month->revenue, 2) }}</span>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>
@endsection

