<?php

namespace Database\Factories;

use App\Models\Stock;
use App\Models\VariationOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VariationStock>
 */
class VariationStockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'stock_id' => Stock::all()->random()->id,
            'variation_option_id' => VariationOption::all()->random()->id,
        ];
    }
}
