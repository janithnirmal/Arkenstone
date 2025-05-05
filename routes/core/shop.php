<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Product;

// Store Pages
Route::get('/shop', function () {
    return Inertia::render('shop');
})->name('shop');

Route::get('/shop/{category_slug}', function ($category_slug) {
    $category = Category::where('slug', $category_slug)->first();
    if (!$category) {
        return redirect()->route('shop');
    }
    return Inertia::render('shop', ['category' => $category]);
})->name('shop.category');

Route::get('/product/{product_slug}', function ($product_slug) {
    $product = Product::with('images', 'category', 'stocks.variationStocks.variationOption.variation')->where('slug', $product_slug)->first();
    if (!$product) {
        return redirect()->route('shop');
    }
    return Inertia::render('product', ['product' => $product]);
})->name('product');


