<?php

namespace Modules\Product\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use Modules\Product\Models\ProductImage;

class ProductImageFactory extends Factory
{
    
    protected $model = ProductImage::class; 

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'product_id' => \Modules\Product\Models\Product::factory(),
            'path' => 'products/' . $this->faker->uuid . '.jpg',
            'alt_text' => $this->faker->sentence,
            'is_primary' => false
        ];
    }
}

