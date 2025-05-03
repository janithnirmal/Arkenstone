<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $images = [
            "https://picsum.photos/id/237/200/300",
            "https://picsum.photos/id/238/200/300",
            "https://picsum.photos/id/239/200/300",
            "https://picsum.photos/id/240/200/300",
            "https://picsum.photos/id/241/200/300",
            "https://picsum.photos/id/242/200/300",
        ];

        $name = $this->faker->name;

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'image' => $this->faker->randomElement($images),
        ];
    }
}
