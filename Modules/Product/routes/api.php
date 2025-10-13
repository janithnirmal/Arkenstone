<?php

use Illuminate\Support\Facades\Route;
use Modules\Product\Http\Controllers\Api\V1\ProductController;
use Modules\Product\Http\Controllers\Api\V1\CategoryController;
use Modules\Product\Http\Controllers\Api\V1\BrandController;
use Modules\Product\Http\Controllers\Api\V1\ProductTaxonomyController;
use Modules\Product\Http\Controllers\Api\V1\TaxonomyController;
use Modules\Product\Http\Controllers\TestProductController;
use Modules\Product\Http\Controllers\Api\V1\TaxonomyTypeController;


// 🔒 protected routes
Route::prefix('v1')
    // ->middleware(["web", "auth:sanctum"])
    ->group(function () {
        // products
        Route::apiResource('products', ProductController::class)->except('index');
        Route::delete('products', [ProductController::class, "destroy"]);

        // product images
        Route::post('/products/images', [ProductController::class, 'uploadImages'])->name('products.images.store');
        Route::delete('/products/images', [ProductController::class, 'destroyImage'])->name('products.images.destroy');

        // categories
        Route::apiResource('categories', CategoryController::class)->except('index');

        // brands
        Route::apiResource('brands', BrandController::class)->except('index');

        // taxonomy types & taxonomies
        Route::apiResources([
            'taxonomy-types' => TaxonomyTypeController::class,
            'taxonomies' => TaxonomyController::class,
        ], ['except' => ['index']]);


        // product ↔ taxonomies linking
        // These routes manage the many-to-many relationship between a specific Product and its Taxonomies.
        // They are nested under `/products/{product}` to follow RESTful principles, ensuring that every
        // action (attaching, syncing, detaching) is performed in the context of a clearly identified product.
        // This makes the API logical and predictable.
        //
        // POST   /products/{product}/taxonomies/attach : Adds one or more taxonomies to the product.
        // PUT    /products/{product}/taxonomies/sync   : Replaces all of the product's taxonomies with a new set.
        // DELETE /products/{product}/taxonomies/{taxonomy} : Removes a single, specific taxonomy from the product.
        Route::prefix('products/{product}')->group(function () {
            Route::post('taxonomies/attach', [ProductTaxonomyController::class, 'attach'])
                ->name('products.taxonomies.attach');

            Route::put('taxonomies/sync', [ProductTaxonomyController::class, 'sync'])
                ->name('products.taxonomies.sync');

            // The taxonomy to detach is now also part of the URL
            Route::delete('taxonomies/{taxonomy}', [ProductTaxonomyController::class, 'detach'])
                ->name('products.taxonomies.detach');
        });
    });

// 🔓 public routes
Route::prefix('v1')->group(function () {
    // products
    Route::get('products', [ProductController::class, "index"]);

    // categories
    Route::get('categories', [CategoryController::class, "index"]);

    // brands
    Route::get('brands', [BrandController::class, "index"]);

    // --- ⚙️ Utility ⚙️ ---
    Route::get("/product-test", [TestProductController::class, "index"]);

    // index endpoints for taxonomy types & taxonomies
    Route::apiResources([
        'taxonomy-types' => TaxonomyTypeController::class,
        'taxonomies' => TaxonomyController::class,
    ], ['only' => ['index']]);
});
