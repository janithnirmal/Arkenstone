<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyUserController;
use App\Http\Controllers\Form\FormController;
use App\Http\Controllers\Form\FormInstanceController;
use App\Http\Controllers\Form\ResponseController;
use App\Http\Controllers\Form\StandardController;
use App\Http\Controllers\ProjectController;
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
});



// 🧪 TESTING
Route::get('/auth-test', [TestController::class, 'index'])->middleware('web', 'auth:sanctum');
Route::get('/role-test', [TestController::class, 'roleTest'])->middleware('web', 'auth:sanctum', 'permission:manage_standard');
Route::get('/event-test', [TestController::class, 'testEvent'])->middleware('web', 'auth:sanctum');