<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/products/test', function () {
    return Inertia::render('Product::test');
})->name('products.test');