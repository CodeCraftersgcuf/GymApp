<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsPremium
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $user = auth()->user();

        if (!$user->isPremium()) {
            return response()->json([
                'error' => 'Premium access required',
                'message' => 'You need a premium account to access this feature.',
                'user_type' => $user->user_type ?? 'simple',
            ], 403);
        }

        return $next($request);
    }
}
