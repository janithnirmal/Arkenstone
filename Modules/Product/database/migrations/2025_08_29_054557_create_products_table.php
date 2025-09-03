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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->onDelete('set null'); // Optional brand
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('sku')->unique(); // Stock Keeping Unit
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->decimal('tax_rate', 5, 2)->default(0.00); // e.g., 0.15 for 15%
            $table->integer('stock')->default(0); // Default stock for simple products, or sum of variants
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['name', 'sku']); // For faster searching
            $table->index(['is_active', 'price']); // For filtering/sorting
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};