<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// ADMIN ROUTES

Route::prefix('admin')->middleware(['auth', 'verified'])->name('admin.products.')->group(function () {
    // Product Management (/admin/products)
    Route::get('products', function () {
        return Inertia::render('Products/Admin/Index');
    })->name('index');

    // Category Management (/admin/categories)
    Route::get('categories', function () {
        return Inertia::render('Products/Admin/Categories');
    })->name('categories');

    // Brand Management (/admin/brands)
    Route::get('brands', function () {
        return Inertia::render('Products/Admin/Brands');
    })->name('brands');

    // Attribute Management (/admin/attributes)
    Route::get('attributes', function () {
        return Inertia::render('Products/Admin/Attributes');
    })->name('attributes');

    // Stock Management (/admin/stock)
    Route::get('stock', function () {
        return Inertia::render('Products/Admin/Stock');
    })->name('stock');
});


// CUSTOMER (PUBLIC) ROUTES

// Product Catalog (/products)
Route::get('products', function () {
    return Inertia::render('products/catalog');
})->name('products.catalog');

// Product Detail Page (/products/{id})
// The {product} parameter is passed to the page props automatically.
// The React component will use this to fetch the product details.
Route::get('products/{product}', function () {
    return Inertia::render('Products/Detail');
})->name('products.detail');

// Promotions Page (/promotions)
Route::get('promotions', function () {
    return Inertia::render('Products/Promotions');
})->name('products.promotions');