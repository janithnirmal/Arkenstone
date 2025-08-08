<?php

namespace Database\Factories;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Blog>
 */
class BlogFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Blog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(6);
        $slug = Str::slug($title);
        
        return [
            'title' => $title,
            'slug' => $slug,
            'content' => $this->faker->paragraphs(5, true),
            'excerpt' => $this->faker->paragraph(2),
            'featured_image' => $this->faker->imageUrl(800, 400, 'business'),
            'status' => $this->faker->randomElement(['draft', 'published']),
            'published_at' => $this->faker->optional()->dateTimeBetween('-1 year', 'now'),
            'user_id' => User::factory(),
            'meta_title' => $this->faker->sentence(4),
            'meta_description' => $this->faker->sentence(10),
            'tags' => $this->faker->words(3),
            'featured' => $this->faker->boolean(20),
        ];
    }

    /**
     * Indicate that the blog is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    /**
     * Indicate that the blog is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the blog is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'featured' => true,
        ]);
    }
}
