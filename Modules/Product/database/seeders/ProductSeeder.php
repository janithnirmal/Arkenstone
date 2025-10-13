<?php

namespace Modules\Product\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Modules\Product\Models\Attribute;
use Modules\Product\Models\Brand;
use Modules\Product\Models\Category;
use Modules\Product\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // =================================================================
        // 1. SETUP: PREPARE AND FETCH ALL NECESSARY DATA
        // =================================================================

        Product::truncate();
        // If you don't have cascading deletes, uncomment and truncate manually:
        // \Modules\Product\Models\ProductVariant::truncate();
        // \Modules\Product\Models\ProductImage::truncate();
        // \DB::table('product_categories')->truncate();
        // \DB::table('product_variant_attribute_values')->truncate();

        $brands = Brand::all()->keyBy('name');
        $categories = Category::all()->keyBy('slug');

        // =================================================================
        // 2. DATA DEFINITION: LOAD FROM JSON FILE
        // =================================================================

        $jsonPath = database_path("data/test-data/products.json");

        if (!File::exists($jsonPath)) {
            $this->command->error("JSON file not found at: {$jsonPath}");
            return;
        }

        // ** THE FIX IS HERE **
        // The 'true' argument converts the JSON objects into associative arrays.
        $productsData = json_decode(File::get($jsonPath), true);

        // Error handling for invalid JSON
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error("Invalid JSON in products.json: " . json_last_error_msg());
            return;
        }

        // =================================================================
        // 3. PROCESSING LOGIC: LOOP THROUGH DATA AND CREATE MODELS
        // =================================================================

        foreach ($productsData as $data) {
            // --- Create the Base Product ---
            $productData = $data['product'];
            $productData['brand_id'] = $brands[$productData['brand_name']]->id;
            $productData['slug'] = Str::slug($productData['name']);
            unset($productData['brand_name']);
            $product = Product::create($productData);

            // --- Attach Categories ---
            $categoryIds = collect($data['categories'])->map(fn($slug) => $categories[$slug]->id);
            $product->categories()->attach($categoryIds);

            // --- Create Images ---
            if (!empty($data['images'])) {
                $product->images()->createMany($data['images']);
            }


        }

        $this->command->info(count($productsData) . ' products seeded successfully from JSON file!');
    }
}