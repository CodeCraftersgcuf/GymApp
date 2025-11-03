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
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coach_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->enum('goal', ['fat_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength']);
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->integer('duration_weeks');
            $table->boolean('is_public')->default(false);
            $table->integer('price_cents')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('coach_id');
            $table->index(['goal', 'level']);
            $table->index('is_public');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
