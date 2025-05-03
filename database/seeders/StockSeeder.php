<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Stock;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Stock::factory()->count(100)->create();

        $stocks = json_decode(file_get_contents(database_path('data/stock.json')), true);
        foreach ($stocks as $stock) {
            Stock::create([
                'product_id' => $stock['product_id'],
                'quantity' => $stock['quantity'],
                'web_price' => $stock['web_price'],
                'pos_price' => $stock['pos_price'],
                'web_discount' => $stock['web_discount'],
                'pos_discount' => $stock['pos_discount'],
                'reserved_quantity' => $stock['reserved_quantity'],
                'barcode' => (string) rand(1000000, 9999999),]);
        }
    }
}
