
<?php

use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/core/pages.php';
require __DIR__ . '/core/shop.php';
require __DIR__ . '/core/admin.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::get('/test-mail', [TestController::class, 'mailTest']);