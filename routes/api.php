<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Shop\CategoryController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// FORM

Route::prefix('v1')->group(function () {

    // Admin
    Route::prefix('admin')->group(function () {
        Route::get('/', [AdminController::class, 'index']);
        Route::post('/', [AdminController::class, 'store']);
        Route::put('/', [AdminController::class, 'update']);
        Route::delete('/', [AdminController::class, 'destroy']);
    });


    // Shop
    Route::prefix('product')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::post('/', [ProductController::class, 'store']);
        Route::put('/', [ProductController::class, 'update']);
        Route::delete('/', [ProductController::class, 'destroy']);
    });

    Route::prefix('category')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/', [CategoryController::class, 'update']);
        Route::delete('/', [CategoryController::class, 'destroy']);
    });
});





// 🧪 TESTING
Route::get('/auth-test', [TestController::class, 'index'])->middleware('web', 'auth:sanctum');
Route::get('/role-test', [TestController::class, 'roleTest'])->middleware('web', 'auth:sanctum', 'permission:manage_standard');
Route::get('/event-test', [TestController::class, 'testEvent'])->middleware('web', 'auth:sanctum');