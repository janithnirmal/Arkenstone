<?php

use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\TestController;
use App\Models\Category;
use App\Models\Product;
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

