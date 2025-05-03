<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\VariationOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stock>
 */
class StockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::all()->random()->id,
            'quantity' => $this->faker->numberBetween(0, 100),
            'web_price' => $this->faker->randomFloat(2, 0, 100),
            'pos_price' => $this->faker->randomFloat(2, 0, 100),
            'web_discount' => $this->faker->randomFloat(2, 0, 10),
            'pos_discount' => $this->faker->randomFloat(2, 0, 10),
            'reserved_quantity' => $this->faker->numberBetween(0, 15),
        ];
    }
}
