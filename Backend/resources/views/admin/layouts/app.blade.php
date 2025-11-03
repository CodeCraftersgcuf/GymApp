<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin Panel') - {{ config('app.name') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    @stack('styles')
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-900 text-white min-h-screen">
            <div class="p-4">
                <h1 class="text-2xl font-bold">{{ config('app.name') }}</h1>
                <p class="text-gray-400 text-sm">Admin Panel</p>
            </div>
            <nav class="mt-8">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 {{ request()->routeIs('admin.dashboard') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-chart-line w-6"></i>
                    <span>Dashboard</span>
                </a>
                <a href="{{ route('admin.users.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 {{ request()->routeIs('admin.users.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-users w-6"></i>
                    <span>Users</span>
                </a>
                <a href="{{ route('admin.programs.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 {{ request()->routeIs('admin.programs.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-dumbbell w-6"></i>
                    <span>Programs</span>
                </a>
                <a href="{{ route('admin.products.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 {{ request()->routeIs('admin.products.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-shopping-bag w-6"></i>
                    <span>Products</span>
                </a>
                <a href="{{ route('admin.orders.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 {{ request()->routeIs('admin.orders.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-receipt w-6"></i>
                    <span>Orders</span>
                </a>
                <a href="{{ route('admin.plans.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 {{ request()->routeIs('admin.plans.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-calendar-check w-6"></i>
                    <span>Plans</span>
                </a>
                <a href="{{ route('admin.exercises.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 {{ request()->routeIs('admin.exercises.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-running w-6"></i>
                    <span>Exercises</span>
                </a>
                <a href="{{ route('admin.faqs.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 {{ request()->routeIs('admin.faqs.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-question-circle w-6"></i>
                    <span>FAQs</span>
                </a>
            </nav>
            <div class="absolute bottom-0 w-64 p-4 border-t border-gray-700">
                <div class="flex items-center justify-between">
                    <span class="text-sm">{{ Auth::user()->name }}</span>
                    <form action="{{ route('admin.logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="text-red-400 hover:text-red-300">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </form>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
            <header class="bg-white shadow-sm border-b">
                <div class="px-6 py-4">
                    <h2 class="text-2xl font-semibold text-gray-800">@yield('page-title', 'Dashboard')</h2>
                </div>
            </header>

            <div class="p-6">
                @if(session('success'))
                    <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {{ session('success') }}
                    </div>
                @endif

                @if(session('error'))
                    <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {{ session('error') }}
                    </div>
                @endif

                @yield('content')
            </div>
        </main>
    </div>
    @stack('scripts')
</body>
</html>

