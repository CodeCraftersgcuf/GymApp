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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // e.g., "Option 1", "Option 2"
            $table->string('bank_name'); // e.g., "Habib Bank Limiteds"
            $table->string('account_title'); // e.g., "PAKFITS"
            $table->string('account_number'); // e.g., "5023 7000 697755"
            $table->string('whatsapp_number')->nullable(); // For sending receipt
            $table->text('description')->nullable(); // Instructions or notes
            $table->integer('order')->default(0); // For sorting
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['is_active', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
