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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('restrict');
            $table->enum('status', ['active', 'inactive', 'cancelled'])->default('active');
            $table->timestamp('started_at');
            $table->timestamp('ends_at')->nullable();
            $table->enum('provider', ['stripe', 'jazzcash', 'easypaisa'])->default('stripe');
            $table->string('provider_ref')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index(['provider', 'provider_ref']);
            $table->index('ends_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
