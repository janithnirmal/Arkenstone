<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

        // Blog routes
        Route::get('blog', function () {
            return Inertia::render('admin/blog/index');
        })->name('admin.blog.index');

        Route::get('blog/create', function () {
            return Inertia::render('admin/blog/create');
        })->name('admin.blog.create');

        Route::get('blog/{blog}/edit', function ($blog) {
            return Inertia::render('admin/blog/edit', ['blog' => $blog]);
        })->name('admin.blog.edit');

    });
});