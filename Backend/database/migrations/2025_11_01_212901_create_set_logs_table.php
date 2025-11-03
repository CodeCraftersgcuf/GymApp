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
        Schema::create('set_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workout_log_id')->constrained()->onDelete('cascade');
            $table->foreignId('exercise_id')->constrained()->onDelete('cascade');
            $table->integer('set_number');
            $table->decimal('weight_kg', 6, 2)->nullable();
            $table->integer('reps');
            $table->decimal('rpe', 3, 1)->nullable()->comment('Rate of Perceived Exertion 1-10');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['workout_log_id', 'set_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('set_logs');
    }
};
