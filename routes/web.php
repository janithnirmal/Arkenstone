<?php

use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\TestController;
use App\Models\Category;
use App\Models\Product;
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
    return redirect()->route('welcome');
})->name('about');

Route::get('/contact', function () {
    return redirect()->route('welcome');
})->name('contact');

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
