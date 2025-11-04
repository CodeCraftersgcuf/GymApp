<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\{
    DashboardController,
    AuthController,
    UserController,
    ProgramController,
    ProductController,
    PackageController,
    OrderController,
    PlanController,
    ExerciseController,
    FaqController,
    ChatController,
    VideoLibraryController,
    BannerController,
    AchievementController,
    ReviewController,
    CommunityController,
    NotificationController,
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

        // Packages
        Route::resource('packages', PackageController::class);

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

        // Chat
        Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
        Route::post('/chat/whatsapp', [ChatController::class, 'updateWhatsAppNumber'])->name('chat.update-whatsapp');
        Route::get('/chat/{user}', [ChatController::class, 'show'])->name('chat.show');
        Route::post('/chat/{user}/send', [ChatController::class, 'sendMessage'])->name('chat.send');

        // Video Libraries
        Route::resource('video-libraries', VideoLibraryController::class);
        Route::post('/video-libraries/{videoLibrary}/items', [VideoLibraryController::class, 'storeItem'])->name('video-libraries.items.store');
        Route::put('/video-libraries/{videoLibrary}/items/{item}', [VideoLibraryController::class, 'updateItem'])->name('video-libraries.items.update');
        Route::delete('/video-libraries/{videoLibrary}/items/{item}', [VideoLibraryController::class, 'destroyItem'])->name('video-libraries.items.destroy');

        // Banners
        Route::resource('banners', BannerController::class);

        // Achievements
        Route::resource('achievements', AchievementController::class);
        Route::post('/achievements/{achievement}/videos', [AchievementController::class, 'storeVideo'])->name('achievements.videos.store');
        Route::put('/achievements/{achievement}/videos/{video}', [AchievementController::class, 'updateVideo'])->name('achievements.videos.update');
        Route::delete('/achievements/{achievement}/videos/{video}', [AchievementController::class, 'destroyVideo'])->name('achievements.videos.destroy');

        // Reviews
        Route::resource('reviews', ReviewController::class);
        
        // Community
        Route::resource('communities', CommunityController::class);
        
        // Notifications
        Route::resource('notifications', NotificationController::class)->except(['edit', 'update']);
    });
});

// Public routes
Route::get('/', function () {
    return view('welcome');
});
