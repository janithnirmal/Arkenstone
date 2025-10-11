<?php

use Carbon\Exceptions\Exception;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Modules\Site\Http\Controllers\SiteController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('sites', SiteController::class)->names('site');
});

// Client Pages
Route::get('welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get("/", function () {
    return Inertia::render('Site::home');
})->name('root');

Route::get("/home", function () {
    return redirect()->route('root');
})->name('home');

Route::get("/about", function () {
    return Inertia::render('Site::about');
})->name('about');

Route::get("/contact", function () {
    return Inertia::render('Site::contact');
})->name('contact');





// Policies
Route::get('/privacy-policy', function () {
    return Inertia::render('Site::policies/privacy-policy');
})->name('privacy-policy');

Route::get('/return-policy', function () {
    return Inertia::render('Site::policies/return-policy');
})->name('return-policy');

Route::get('/terms-and-conditions', function () {
    return Inertia::render('Site::policies/terms-and-conditions');
})->name('terms-and-conditions');


// utility
Route::get("/site/test", function () {
    return Inertia::render('Site::test');
})->name('site.test');
