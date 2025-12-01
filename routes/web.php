<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';


// test
Route::get('/solar-system', function () {
    return response()->json([
        'status' => "success",
        'message' => "Solar System Data",
        'data' => [
            [
                'id' => 1,
                'name' => 'Mercury',
                'radius' => 2440,
                'habitable' => false,
                'moons' => 0,
                'planetHash' => 'mercury',
            ],
            [
                'id' => 2,
                'name' => 'Venus',
                'radius' => 6052,
                'habitable' => false,
                'moons' => 0,
                'planetHash' => 'venus',
            ],
            [
                'id' => 3,
                'name' => 'Earth',
                'radius' => 6371,
                'habitable' => true,
                'moons' => 1,
                'planetHash' => 'earth',
            ],
            [
                'id' => 4,
                'name' => 'Mars',
                'radius' => 3396,
                'habitable' => false,
                'moons' => 2,
                'planetHash' => 'mars',
            ],
            [
                'id' => 5,
                'name' => 'Jupiter',
                'radius' => 69911,
                'habitable' => false,
                'moons' => 79,
                'planetHash' => 'jupiter',
            ],
            [
                'id' => 6,
                'name' => 'Saturn',
                'radius' => 58232,
                'habitable' => false,
                'moons' => 62,
                'planetHash' => 'saturn',
            ],
            [
                'id' => 7,
                'name' => 'Uranus',
                'radius' => 25362,
                'habitable' => false,
                'moons' => 27,
                'planetHash' => 'uranus',
            ],
            [
                'id' => 8,
                'name' => 'Neptune',
                'radius' => 24764,
                'habitable' => false,
                'moons' => 14,
                'planetHash' => 'neptune',
            ],
        ]
    ]);
});

Route::get('/test-ui/lead-generation', function () {
    return Inertia::render('LeadGenerationTest');
});

Route::get('/test-ui/product', function () {
    return Inertia::render('ProductTest');
});

Route::get('/test-ui/service-factory', function () {
    return Inertia::render('ServiceFactoryTest');
});