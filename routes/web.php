<?php

use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\TestController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return redirect()->route('welcome');
});

// Client Pages
Route::get('welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/home', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

// Store Pages
Route::get('/shop', function () {
    return Inertia::render('shop');
})->name('shop');




// Admin Pages
Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->name('dashboard');

Route::get('test', function () {
    return Inertia::render('test');
})->name('admin.test');

Route::get('/admin', function () {
    return redirect()->route('admin.dashboard');
})->name('admin');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('admin')->group(function () {

        Route::get('dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('admin.dashboard');

        Route::get('admins', function () {
            return Inertia::render('admin/admins');
        })->name('admin.admins');

    });
});

require __DIR__ . '/settings.php';

require __DIR__ . '/auth.php';

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::get('/test-mail', [TestController::class, 'mailTest']);
