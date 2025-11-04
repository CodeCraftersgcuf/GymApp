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
        <aside class="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
            <div class="p-4 border-b border-gray-700">
                <h1 class="text-2xl font-bold">{{ config('app.name') }}</h1>
                <p class="text-gray-400 text-sm">Admin Panel</p>
            </div>
            <nav class="flex-1 overflow-y-auto mt-4">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.dashboard') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-chart-line w-5 text-center mr-3"></i>
                    <span class="flex-1">Dashboard</span>
                </a>
                <a href="{{ route('admin.users.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.users.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-users w-5 text-center mr-3"></i>
                    <span class="flex-1">Users</span>
                </a>
                <a href="{{ route('admin.programs.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.programs.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-dumbbell w-5 text-center mr-3"></i>
                    <span class="flex-1">Programs</span>
                </a>
                <a href="{{ route('admin.products.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.products.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-shopping-bag w-5 text-center mr-3"></i>
                    <span class="flex-1">Products</span>
                </a>
                <a href="{{ route('admin.packages.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.packages.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-credit-card w-5 text-center mr-3"></i>
                    <span class="flex-1">Packages</span>
                </a>
                <a href="{{ route('admin.orders.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.orders.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-receipt w-5 text-center mr-3"></i>
                    <span class="flex-1">Orders</span>
                </a>
                <a href="{{ route('admin.plans.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.plans.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-calendar-check w-5 text-center mr-3"></i>
                    <span class="flex-1">Plans</span>
                </a>
                <a href="{{ route('admin.exercises.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.exercises.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-running w-5 text-center mr-3"></i>
                    <span class="flex-1">Exercises</span>
                </a>
                <a href="{{ route('admin.faqs.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.faqs.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-question-circle w-5 text-center mr-3"></i>
                    <span class="flex-1">FAQs</span>
                </a>
                <a href="{{ route('admin.chat.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.chat.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-comments w-5 text-center mr-3"></i>
                    <span class="flex-1">Chat</span>
                </a>
                <a href="{{ route('admin.video-libraries.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.video-libraries.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-video w-5 text-center mr-3"></i>
                    <span class="flex-1">Video Libraries</span>
                </a>
                <a href="{{ route('admin.banners.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.banners.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-image w-5 text-center mr-3"></i>
                    <span class="flex-1">Banners</span>
                </a>
                <a href="{{ route('admin.achievements.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.achievements.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-trophy w-5 text-center mr-3"></i>
                    <span class="flex-1">Achievements</span>
                </a>
                <a href="{{ route('admin.reviews.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.reviews.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-star w-5 text-center mr-3"></i>
                    <span class="flex-1">Reviews</span>
                </a>
                <a href="{{ route('admin.communities.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.communities.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-share-alt w-5 text-center mr-3"></i>
                    <span class="flex-1">Community</span>
                </a>
                <a href="{{ route('admin.notifications.index') }}" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors duration-200 {{ request()->routeIs('admin.notifications.*') ? 'bg-gray-800 border-r-4 border-blue-500' : '' }}">
                    <i class="fas fa-bell w-5 text-center mr-3"></i>
                    <span class="flex-1">Notifications</span>
                </a>
            </nav>
            <div class="p-4 border-t border-gray-700 mt-auto">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-300 truncate">{{ Auth::user()->name }}</span>
                    <form action="{{ route('admin.logout') }}" method="POST" class="inline">
                        @csrf
                        <button type="submit" class="text-red-400 hover:text-red-300 transition-colors duration-200 ml-2" title="Logout">
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

