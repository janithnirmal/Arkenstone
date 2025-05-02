<?php

use App\Http\Controllers\TestController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('welcome', function () {
        return Inertia::render('welcome');
    })->name('welcome');
    
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('admins', function () {
        return Inertia::render('admins');
    })->name('admins');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::get('/test-mail', [TestController::class, 'mailTest']);
