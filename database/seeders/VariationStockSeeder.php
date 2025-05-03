<?php

namespace Database\Seeders;

use App\Models\VariationStock;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class VariationStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // VariationStock::factory()->count(100)->create();

        $variationStocks = json_decode(file_get_contents(database_path('data/variationStock.json')), true);
        foreach ($variationStocks as $variationStock) {
            foreach ($variationStock as $variation) {

                Log::info($variation);

                VariationStock::create([
                    'stock_id' => $variation['stock_id'],
                    'variation_option_id' => $variation['variation_option_id'],
                ]);
            }
        }
    }
}
