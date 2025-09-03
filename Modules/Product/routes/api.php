<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Modules\Product\Http\Controllers\Api\V1\ProductController;
use Modules\Product\Http\Controllers\Api\V1\CategoryController;
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
    Route::apiResource('categories', CategoryController::class); 
});