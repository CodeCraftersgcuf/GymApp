<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->unique()->after('email');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('phone');
            $table->date('dob')->nullable()->after('gender');
            $table->decimal('height_cm', 5, 2)->nullable()->after('dob');
            $table->decimal('weight_kg', 5, 2)->nullable()->after('height_cm');
            $table->enum('goal', ['fat_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength'])->nullable()->after('weight_kg');
            $table->string('locale', 10)->default('en')->after('goal');
            $table->string('timezone', 50)->default('UTC')->after('locale');
            $table->text('notification_token')->nullable()->after('timezone');
            $table->timestamp('last_login_at')->nullable()->after('notification_token');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'gender', 'dob', 'height_cm', 'weight_kg', 
                'goal', 'locale', 'timezone', 'notification_token', 
                'last_login_at', 'deleted_at'
            ]);
        });
    }
};
