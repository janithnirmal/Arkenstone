<?php

namespace Database\Factories;

use App\Models\Variation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VariationOption>
 */
class VariationOptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'variation_id' => Variation::inRandomOrder()->first()->id,
            'name' => fake()->word(),
        ];
    }
}
