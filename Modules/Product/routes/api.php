<?php

use Illuminate\Support\Facades\Route;
use Modules\Product\Http\Controllers\Api\ProductController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class)->only(['store', 'update', 'delete']);
    Route::get("products", [ProductController::class, 'index'])->withoutMiddleware('auth:sanctum');
});

