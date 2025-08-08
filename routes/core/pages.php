
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('/blog', function () {
    return Inertia::render('blog');
})->name('blog');

Route::get('/blog/{slug}', function ($slug) {
    return Inertia::render('blog-single', ['slug' => $slug]);
})->name('blog.single');

// Policies
Route::get('/privacy-policy', function () {
    return Inertia::render('policies/privacy-policy');
})->name('privacy-policy');

Route::get('/return-policy', function () {
    return Inertia::render('policies/return-policy');
})->name('return-policy');

Route::get('/terms-and-conditions', function () {
    return Inertia::render('policies/terms-and-conditions');
})->name('terms-and-conditions');
