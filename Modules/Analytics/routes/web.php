<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Modules\Analytics\Http\Controllers\AnalyticsController;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('analytics', AnalyticsController::class)->names('analytics');
});


Route::get("test-1", function() {
    return Inertia::render("analytics");
});
