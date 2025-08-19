<?php

namespace Modules\Product\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Modules\Product\Models\Term;

class TermFactory extends Factory
{

    protected $model = Term::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->word;
        return [
            'taxonomy_id' => \Modules\Product\Models\Taxonomy::factory(),
            'name' => $name,
            'slug' => Str::slug($name)
        ];
    }
}

