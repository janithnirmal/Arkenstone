<?php

use Illuminate\Support\Facades\Route;
use Modules\Product\Http\Controllers\Api\V1\ProductController;
use Modules\Product\Http\Controllers\Api\V1\CategoryController;
use Modules\Product\Http\Controllers\Api\V1\BrandController;
use Modules\Product\Http\Controllers\TestProductController;


// 🔒 protected routes
Route::prefix('v1')
    // ->middleware(["web", "auth:sanctum"])
    ->group(function () {
        // products
        Route::apiResource('products', ProductController::class)->except('index');
        // product images
        Route::post('/products/{product}/images', [ProductController::class, 'uploadImages'])->name('products.images.store');
        Route::delete('/products/images/{product_image}', [ProductController::class, 'destroyImage'])->name('products.images.destroy');

        // categories
        Route::apiResource('categories', CategoryController::class)->except('index');

        // brands
        Route::apiResource('brands', BrandController::class)->except('index');

    });

// 🔓 public routes
Route::prefix('v1')->group(function () {
    // products
    Route::get('products', [ProductController::class, "index"]);

    // categories
    Route::get('categories', [CategoryController::class, "index"]);

    // brands
    Route::get('brands', [BrandController::class, "index"]);

    // --- ⚙️ Utility ⚙️ ---
    Route::get("/product-test", [TestProductController::class, "index"]);
});
