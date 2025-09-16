<?php

use Illuminate\Support\Facades\Route;
use Modules\Product\Http\Controllers\Api\V1\ProductController;
use Modules\Product\Http\Controllers\Api\V1\CategoryController;
use Modules\Product\Http\Controllers\Api\V1\BrandController;
use Modules\Product\Http\Controllers\TestProductController;


// auth routes
Route::prefix('v1')->middleware(["web", "auth:sanctum"])->group(function () {
    // products API
    Route::apiResource('products', ProductController::class)->except('index');
    // product images API
    Route::post('/products/{product}/images', [ProductController::class, 'uploadImages'])->name('products.images.store');
    Route::delete('/products/images/{product_image}', [ProductController::class, 'destroyImage'])->name('products.images.destroy');

    // categories API
    Route::apiResource('categories', CategoryController::class)->except('index');

    // brands API
    Route::apiResource('brands', BrandController::class)->except('index');

    // // --- Attributes and Attribute Values ---
    // Route::apiResource('attributes', AttributeController::class)->except(['show'])->except('index');
    // Route::post('/attributes/{attribute}/values', [AttributeController::class, 'storeValue']);
    // Route::put('/attributes/values/{attribute_value}', [AttributeController::class, 'updateValue']);
    // Route::delete('/attributes/values/{attribute_value}', [AttributeController::class, 'destroyValue']);

    // // --- Product Variants ---
    // Route::post('/products/{product}/variants', [ProductVariantController::class, 'store']);
    // Route::put('/products/variants/{variant}', [ProductVariantController::class, 'update']);
    // Route::delete('/products/variants/{variant}', [ProductVariantController::class, 'destroy']);

    // // --- Promotions ---
    // Route::apiResource('promotions', PromotionController::class)->except('index');

    // // --- Stock Management ---
    // Route::put('/products/{product}/stock', [ProductController::class, 'updateStock'])->name('products.stock.update');
    // Route::put('/products/variants/{variant}/stock', [ProductVariantController::class, 'updateStock'])->name('variants.stock.update');
});

// public routes
Route::prefix('v1')->group(function () {
    // products API
    Route::get('products', [ProductController::class, "index"]);

    // categories API
    Route::get('categories', [CategoryController::class, "index"]);

    // brands API
    Route::get('brands', [BrandController::class, "index"]);

    // // --- Attributes and Attribute Values ---
    // Route::get('attributes', [AttributeController::class, 'index']);

    // // --- Promotions ---
    // Route::get('promotions', [PromotionController::class, "index"]);

    // --- ⚙️ Utility ⚙️ ---
    Route::get("/product-test", [TestProductController::class, "index"]);
});
