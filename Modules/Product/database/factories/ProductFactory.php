<?php

namespace Modules\Product\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Modules\Product\Models\Brand;
use Modules\Product\Models\Category;
use Modules\Product\Models\ProductImage;
use Modules\Product\Models\Term;

class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\Product\Models\Product::class;

    /**
     * Define the model's default state.
     */
    public function definition()
    {
        $name = $this->faker->unique()->words(3, true);
        $price = $this->faker->randomFloat(2, 10, 1000);

        return [
            'brand_id' => Brand::inRandomOrder()->first()?->id,
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph,
            'sku' => $this->faker->unique()->ean13,
            'price' => $price,
            'discount_price' => $this->faker->optional(0.5)->randomFloat(2, 5, $price - 1), // Optional discount
            'quantity' => $this->faker->numberBetween(0, 100),
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (\Modules\Product\Models\Product $product) {
            // // Attach 1 to 3 random categories
            // $categories = Category::inRandomOrder()->limit(rand(1, 3))->pluck('id');
            // $product->categories()->attach($categories);

            // // Attach 2 to 5 random terms
            // $terms = Term::inRandomOrder()->limit(rand(2, 5))->pluck('id');
            // $product->terms()->attach($terms);

            // // Create a primary image
            // ProductImage::factory()->create([
            //     'product_id' => $product->id,
            //     'is_primary' => true,
            // ]);

            // // Create 2-4 additional images
            // ProductImage::factory(rand(2, 4))->create([
            //     'product_id' => $product->id,
            //     'is_primary' => false,
            // ]);
        });
    }
}

