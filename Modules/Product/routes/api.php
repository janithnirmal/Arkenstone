<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Modules\Product\Http\Controllers\Api\V1\ProductController;
// use Modules\Product\Http\Controllers\Api\ProductController;

// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('products', ProductController::class)->only(['store', 'update', 'delete']);
//     Route::get("products", [ProductController::class, 'index'])->withoutMiddleware('auth:sanctum');
// });



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
});