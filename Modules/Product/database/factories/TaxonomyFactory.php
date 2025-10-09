<?php

namespace Modules\Product\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Product\Models\TaxonomyType;
use Str;

class TaxonomyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\Product\Models\Taxonomy::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $name = ucfirst($this->faker->unique()->words(mt_rand(1, 3), true));
        return [
            'taxonomy_type_id' => TaxonomyType::query()->inRandomOrder()->value('id') ?? TaxonomyType::factory(),
            'parent_id' => null, // Assigned conditionally in seeder for hierarchy
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name) . '-' . \Illuminate\Support\Str::random(5), // ensure uniqueness within type
            'description' => $this->faker->optional()->sentence(),
            'sort_order' => $this->faker->numberBetween(0, 100),
            'meta' => $this->faker->optional()->randomElements([
                'highlight' => true,
                'filterable' => $this->faker->boolean(),
            ], 2),
        ];
    }
}

