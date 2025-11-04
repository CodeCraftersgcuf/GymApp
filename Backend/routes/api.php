<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\{
    AuthController,
    HealthController,
    ConfigController,
    ProgramController,
    UserProgramController,
    WorkoutLogController,
    NutritionLogController,
    ProgressLogController,
    CheckInController,
    ProductController,
    PackageController,
    OrderController,
    WebhookController,
    CoachController,
    PlanController,
    ExerciseController,
    FaqController,
    MessageController,
    VideoLibraryController,
    BannerController,
    AchievementController,
    ReviewController,
    CommunityController,
    NotificationController,
};

// Public routes
Route::prefix('v1')->group(function () {
    Route::get('/health', [HealthController::class, 'index']);
    Route::get('/config', [ConfigController::class, 'index']);
    
    // Public programs
    Route::get('/programs', [ProgramController::class, 'index']);
    Route::get('/programs/{id}', [ProgramController::class, 'show']);
    
    // Public plans
    Route::get('/plans', [PlanController::class, 'index']);
    Route::get('/plans/{id}', [PlanController::class, 'show']);
    
    // Public exercises
    Route::get('/exercises', [ExerciseController::class, 'index']);
    Route::get('/exercises/{id}', [ExerciseController::class, 'show']);
    
    // Public FAQs
    Route::get('/faqs', [FaqController::class, 'index']);
    Route::get('/faqs/{id}', [FaqController::class, 'show']);
    
    // Public video libraries
    Route::get('/video-libraries', [VideoLibraryController::class, 'index']);
    Route::get('/video-libraries/{id}', [VideoLibraryController::class, 'show']);
    
    // Public banners
    Route::get('/banners', [BannerController::class, 'index']);
    Route::get('/banners/{id}', [BannerController::class, 'show']);
    
    // Public achievements
    Route::get('/achievements', [AchievementController::class, 'index']);
    Route::get('/achievements/{id}', [AchievementController::class, 'show']);
    
    // Public reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/reviews/{id}', [ReviewController::class, 'show']);
    
    // Public communities (social media links)
    Route::get('/communities', [CommunityController::class, 'index']);
    Route::get('/communities/{id}', [CommunityController::class, 'show']);
    
    // Public products/packages
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    
    // Public payment packages
    Route::get('/packages', [PackageController::class, 'index']);
    Route::get('/packages/{id}', [PackageController::class, 'show']);
    
    // Public WhatsApp support number
    Route::get('/messages/whatsapp-support', [MessageController::class, 'whatsappSupport']);
    
    // Auth routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    // Webhooks (no auth)
    Route::post('/webhooks/stripe', [WebhookController::class, 'stripe']);
});

// Authenticated routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/auth/me', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'updatePassword']);
    
    // User Programs
    Route::get('/user-programs', [UserProgramController::class, 'index']);
    Route::post('/user-programs', [UserProgramController::class, 'store']);
    Route::get('/user-programs/{id}', [UserProgramController::class, 'show']);
    
    // Workout Logs
    Route::get('/workout-logs', [WorkoutLogController::class, 'index']);
    Route::post('/workout-logs', [WorkoutLogController::class, 'store']);
    Route::get('/workout-logs/{id}', [WorkoutLogController::class, 'show']);
    
    // Nutrition Logs
    Route::get('/nutrition-logs', [NutritionLogController::class, 'index']);
    Route::post('/nutrition-logs', [NutritionLogController::class, 'store']);
    
    // Progress Logs
    Route::get('/progress-logs', [ProgressLogController::class, 'index']);
    Route::post('/progress-logs', [ProgressLogController::class, 'store']);
    
    // Check-ins
    Route::get('/check-ins', [CheckInController::class, 'index']);
    Route::post('/check-ins', [CheckInController::class, 'store']);
    
    // Messages/Chat
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    
    // Premium Plans (My Plans) - Premium users only
    Route::get('/myplans', [PlanController::class, 'myPlans'])->middleware('premium');
    Route::get('/myplans/{id}', [PlanController::class, 'show'])->middleware('premium');
    
    // Products & Orders
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    
    // Coach routes
    Route::prefix('coach')->middleware('role:Coach|Admin')->group(function () {
        Route::get('/clients', [CoachController::class, 'clients']);
        Route::get('/clients/{userId}/overview', [CoachController::class, 'clientOverview']);
        Route::post('/programs', [ProgramController::class, 'store']);
        Route::post('/meal-plans', [CoachController::class, 'createMealPlan']);
        Route::post('/check-ins/{id}/complete', [CheckInController::class, 'complete']);
    });
});
