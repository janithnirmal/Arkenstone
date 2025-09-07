<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Modules\Product\Http\Controllers\Api\V1\ProductController;
use Modules\Product\Http\Controllers\Api\V1\CategoryController;
use Modules\Product\Http\Controllers\Api\V1\BrandController; 
use Modules\Product\Http\Controllers\Api\V1\AttributeController;
use Modules\Product\Http\Controllers\Api\V1\ProductVariantController;
// use Modules\Product\Http\Controllers\Api\ProductController;

// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('products', ProductController::class)->only(['store', 'update', 'delete']);
//     Route::get("products", [ProductController::class, 'index'])->withoutMiddleware('auth:sanctum');
// });

// Route::prefix('v1')->group(function () {
//     Route::apiResource('products', ProductController::class);
// });

Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::post('/products/{product}/images', [ProductController::class, 'uploadImages'])->name('products.images.store');
    Route::delete('/products/images/{product_image}', [ProductController::class, 'destroyImage'])->name('products.images.destroy');
    
    Route::apiResource('categories', CategoryController::class);

    Route::apiResource('brands', BrandController::class);   
    
    // --- Attributes and Attribute Values ---
    Route::apiResource('attributes', AttributeController::class)->except(['show']);
    Route::post('/attributes/{attribute}/values', [AttributeController::class, 'storeValue']);
    Route::put('/attributes/values/{attribute_value}', [AttributeController::class, 'updateValue']);
    Route::delete('/attributes/values/{attribute_value}', [AttributeController::class, 'destroyValue']);
    
    // --- Product Variants ---
    Route::post('/products/{product}/variants', [ProductVariantController::class, 'store']);
    Route::put('/products/variants/{variant}', [ProductVariantController::class, 'update']);
    Route::delete('/products/variants/{variant}', [ProductVariantController::class, 'destroy']);
});