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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['product', 'category', 'taxonomy', 'brand', 'global']); // Added 'brand' and 'global' for flexibility
            $table->unsignedBigInteger('entity_id')->nullable(); // ID of the product, category, brand, etc. if type is not 'global'
            $table->decimal('discount_percent', 5, 2)->nullable(); // e.g., 10.50 for 10.5%
            $table->decimal('discount_fixed', 10, 2)->nullable(); // e.g., $10 off
            $table->timestamp('start_date');
            $table->timestamp('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'entity_id']); // For quick lookup of applicable promotions
            $table->index(['start_date', 'end_date', 'is_active']); // For checking active promotions
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};