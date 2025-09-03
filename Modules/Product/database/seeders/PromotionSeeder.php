<?php

namespace Modules\Product\Database\Seeders;

use Modules\Product\Models\Category;
use Modules\Product\Models\Product;
use Modules\Product\Models\Promotion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Promotion::truncate(); // Clear existing promotions

        $product = Product::first(); // Get the first product (e.g., T-Shirt)
        $category = Category::where('slug', 'electronics')->first();

        // Product-specific promotion
        if ($product) {
            Promotion::create([
                'title' => 'Launch Discount: T-Shirt',
                'description' => 'Get 15% off our new Classic Cotton T-Shirt!',
                'type' => 'product',
                'entity_id' => $product->id,
                'discount_percent' => 15.00,
                'start_date' => Carbon::now()->subDays(5),
                'end_date' => Carbon::now()->addDays(10),
                'is_active' => true,
            ]);
        }

        // Category-specific promotion
        if ($category) {
            Promotion::create([
                'title' => 'Electronics Sale',
                'description' => '10% off all items in the Electronics category!',
                'type' => 'category',
                'entity_id' => $category->id,
                'discount_percent' => 10.00,
                'start_date' => Carbon::now()->subDays(2),
                'end_date' => Carbon::now()->addDays(7),
                'is_active' => true,
            ]);
        }

        // Global promotion (fixed amount off)
        Promotion::create([
            'title' => 'Weekend Flash Sale!',
            'description' => 'Save $5 on any order over $50!',
            'type' => 'global',
            'entity_id' => null, // No specific entity for global
            'discount_fixed' => 5.00,
            'start_date' => Carbon::now()->subHours(12),
            'end_date' => Carbon::now()->addHours(36),
            'is_active' => true,
        ]);

        // Inactive/Expired promotion example
        Promotion::create([
            'title' => 'Old Summer Sale',
            'description' => 'This promotion has expired.',
            'type' => 'global',
            'entity_id' => null,
            'discount_percent' => 20.00,
            'start_date' => Carbon::now()->subMonth(2),
            'end_date' => Carbon::now()->subMonth(1),
            'is_active' => false,
        ]);

        $this->command->info('Promotions seeded!');
    }
}