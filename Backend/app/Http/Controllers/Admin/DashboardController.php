<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Subscription;
use App\Models\WorkoutLog;
use App\Models\NutritionLog;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!auth()->check() || !auth()->user()->hasRole('Admin')) {
                abort(403);
            }
            return $next($request);
        });
    }

    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'mrr' => Subscription::where('status', 'active')
                ->join('products', 'subscriptions.product_id', '=', 'products.id')
                ->where('products.interval', 'monthly')
                ->sum('products.price_cents') / 100,
            'workouts_this_week' => WorkoutLog::whereBetween('performed_at', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
            'nutrition_logs_this_week' => NutritionLog::whereBetween('logged_at', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
        ];

        // New users per week (last 8 weeks)
        $newUsers = User::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%u") as week'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subWeeks(8))
            ->groupBy('week')
            ->orderBy('week')
            ->get();

        // Revenue per month (last 6 months)
        $revenue = Order::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('SUM(amount_cents) / 100 as revenue')
            )
            ->where('status', 'paid')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return view('admin.dashboard.index', compact('stats', 'newUsers', 'revenue'));
    }
}
