<?php

use Illuminate\Support\Facades\Route;
use Modules\Analytics\Http\Controllers\AnalyticsController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('analytics', AnalyticsController::class)->names('analytics');
});
