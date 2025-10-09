<?php

namespace Modules\Product\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TaxonomyTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\Product\Models\TaxonomyType::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $name = ucfirst($this->faker->unique()->words(mt_rand(1, 2), true));
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}

