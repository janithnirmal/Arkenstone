<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Stock;
use App\Models\VariationOption;
use App\Models\VariationStock;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TestProductDataSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {


        // delete images in storage
        Storage::disk("products")->delete(Storage::disk("products")->allFiles());

        $products = json_decode(file_get_contents(database_path('data/shop/test-product-data.json')), true);

        foreach ($products as $product) {
            $savedProduct = Product::create([
                'name' => $product['name'],
                'slug' => $product['slug'],
                'description' => $product['description'],
                'category_id' => $product['category_id'],
            ]);

            Log::info('Product ID: ' . $savedProduct->id);

            foreach ($product['stock'] as $stock) {
                $savedStock = Stock::create([
                    'product_id' => $savedProduct->id,
                    'quantity' => $stock['quantity'],
                    'web_price' => $stock['web_price'],
                    'pos_price' => $stock['pos_price'],
                    'web_discount' => $stock['web_discount'],
                    'pos_discount' => $stock['pos_discount'],
                    'reserved_quantity' => $stock['reserved_quantity'],
                ]);

                Log::info('Stock ID: ' . $savedStock->id);

                foreach ($stock['variationOption'] as $variationOption) {
                    VariationStock::create([
                        'stock_id' => $savedStock->id,
                        'variation_option_id' => $variationOption['variation_option_id'],
                    ]);
                }
            }
        }

        // copy images
        $diskData = Storage::disk("data");
        $sourceFolder = "images/products/";
        $destinationFolder = storage_path("app/public/images/products/");

        foreach ($diskData->allFiles($sourceFolder) as $file) {
            File::copy($diskData->path($file), $destinationFolder . basename($file));
        }
    }

    
}
