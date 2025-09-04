<?php

use Illuminate\Support\Facades\Route;
use Modules\Product\Http\Controllers\Api\V1\ProductController;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('products', ProductController::class)->names('product');
});
