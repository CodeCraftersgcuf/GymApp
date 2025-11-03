<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\User;
use Illuminate\Http\Request;

class ProgramController extends Controller
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

    public function index(Request $request)
    {
        $query = Program::with('coach');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->has('goal')) {
            $query->where('goal', $request->goal);
        }

        $programs = $query->paginate(15)->withQueryString();
        return view('admin.programs.index', compact('programs'));
    }

    public function show(Program $program)
    {
        $program->load(['coach', 'phases.workouts.exercises']);
        return view('admin.programs.show', compact('program'));
    }

    public function destroy(Program $program)
    {
        $program->delete();
        return redirect()->route('admin.programs.index')->with('success', 'Program deleted successfully.');
    }
}
