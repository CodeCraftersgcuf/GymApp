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
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('equipment', ['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'machine', 'cables', 'resistance_bands', 'other'])->default('bodyweight');
            $table->enum('primary_muscle', ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'full_body'])->default('full_body');
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->text('description')->nullable();
            $table->string('video_url')->nullable();
            $table->text('instructions')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['equipment', 'primary_muscle']);
            $table->index('difficulty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
