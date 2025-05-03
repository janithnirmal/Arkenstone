<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Taxonomy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaxonomyProduct>
 */
class TaxonomyProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'taxonomy_id' => Taxonomy::get()->random()->id,
            'product_id' => Product::get()->random()->id,
        ];
    }
}
