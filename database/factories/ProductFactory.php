<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Taxonomy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'slug' => $this->faker->slug,
            'description' => $this->faker->description,
            'category_id' => Category::get()->random()->id,
        ];
    }
}
