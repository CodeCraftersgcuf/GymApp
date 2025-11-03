<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\{
    DashboardController,
    AuthController,
    UserController,
    ProgramController,
    ProductController,
    OrderController,
    PlanController,
    ExerciseController,
    FaqController,
};

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Authentication
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Protected Admin Routes
    Route::middleware(['auth'])->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Users
        Route::resource('users', UserController::class);

        // Programs
        Route::get('/programs', [ProgramController::class, 'index'])->name('programs.index');
        Route::get('/programs/{program}', [ProgramController::class, 'show'])->name('programs.show');
        Route::delete('/programs/{program}', [ProgramController::class, 'destroy'])->name('programs.destroy');

        // Products
        Route::resource('products', ProductController::class);

        // Orders
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

        // Plans
        Route::resource('plans', PlanController::class);
        Route::post('/plans/{plan}/videos', [PlanController::class, 'storeVideo'])->name('plans.videos.store');
        Route::put('/plans/{plan}/videos/{video}', [PlanController::class, 'updateVideo'])->name('plans.videos.update');
        Route::delete('/plans/{plan}/videos/{video}', [PlanController::class, 'destroyVideo'])->name('plans.videos.destroy');

        // Exercises
        Route::resource('exercises', ExerciseController::class);

        // FAQs
        Route::resource('faqs', FaqController::class)->except(['show']);
    });
});

// Public routes
Route::get('/', function () {
    return view('welcome');
});
