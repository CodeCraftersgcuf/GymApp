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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'is_read', 'created_at']);
            $table->index('admin_id');
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
