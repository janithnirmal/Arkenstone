<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->integer('product_id')->references('id')->on('products');
            $table->integer('quantity')->default(0);
            $table->double('web_price')->default(0);
            $table->double('pos_price')->default(0);
            $table->double('web_discount')->default(0);
            $table->double('pos_discount')->default(0);
            $table->double('cost')->default(0);
            $table->double('alert_quantity')->default(20);
            $table->date('purchase_date')->default(DB::raw('CURRENT_DATE'));
            $table->string('barcode')->nullable();
            
        
            $table->integer('supplier_id')->references('id')->on('suppliers')->default(1);

            $table->integer('reserved_quantity')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
