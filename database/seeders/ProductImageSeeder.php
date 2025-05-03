<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::get()->each(function (Product $product) {
            for ($i = 0; $i < rand(1, 6); $i++) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => 'https://picsum.photos/seed/' . $product->slug . '-' . $i . '/200/300',
                ]);
            }
        });
    }
}
