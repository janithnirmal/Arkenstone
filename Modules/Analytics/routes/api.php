<?php

use Illuminate\Support\Facades\Route;
use Modules\Analytics\Http\Controllers\Api\AnalyticsController;

Route::prefix('v1')->group(function () {
    Route::prefix('analytics')->group(function () {
        Route::get('/', [AnalyticsController::class, 'query']);
        Route::post('/', [AnalyticsController::class, 'track']);
    });
});