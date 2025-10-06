<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==========================================
// Core Routes
// Do not edit the contents of these file
require __DIR__ . '/core.php';
//
// ==========================================



// Update From Here 👇

// landing route (update as you need)
Route::get('/', function () {
    return redirect()->route('welcome');
});



//test route
Route::get('/test-audit-middleware', function () {
    return response()->json([
        'message' => 'Audit middleware test',
        'timestamp' => now(),
        'user' => auth()->user?->email ?? 'guest',
        'middleware_active' => 'yes'
    ]);
});


Route::get('test', function () {
    return Inertia::render('test');
})->name('admin.test');