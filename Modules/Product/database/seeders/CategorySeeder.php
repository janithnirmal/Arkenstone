<?php

namespace Modules\Product\Database\Seeders;

use Modules\Product\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing categories to prevent duplicates on re-seed
        Category::truncate();

        $categories = [
            ['name' => 'Electronics'],
            ['name' => 'Fashion'],
            ['name' => 'Home & Kitchen'],
            ['name' => 'Books'],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'slug' => Str::slug($categoryData['name']),
            ]);

            // Add subcategories
            if ($category->name === 'Electronics') {
                $category->children()->createMany([
                    ['name' => 'Laptops', 'slug' => 'laptops'],
                    ['name' => 'Smartphones', 'slug' => 'smartphones'],
                    ['name' => 'Cameras', 'slug' => 'cameras'],
                ]);
            } elseif ($category->name === 'Fashion') {
                $category->children()->createMany([
                    ['name' => 'Men\'s Clothing', 'slug' => 'mens-clothing'],
                    ['name' => 'Women\'s Clothing', 'slug' => 'womens-clothing'],
                    ['name' => 'Footwear', 'slug' => 'footwear'],
                ]);
            }
        }

        $this->command->info('Categories seeded!');
    }
}