<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Product::factory()->count(10)->create();

        $products = json_decode(file_get_contents(database_path('data/shop/products.json')), true);

        foreach ($products as $product) {
            Product::create([
                'name' => $product['name'],
                'slug' => $product['slug'],
                'description' => $product['description'],
                'category_id' => $product['category_id'],
            ]);
        }
    }
}
