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
            ['name' => 'Books'],
            ['name' => 'mens-clothing'],
            ['name' => 'womens-clothing'],
            ['name' => 'smartphones'],
            ['name' => 'laptops'],
            ['name' => 'headphones'],
            ['name' => 'wearables'],
            ['name' => 'computer-accessories'],
            ['name' => 'mens-footwear'],
            ['name' => 'womens-footwear'],
            ['name' => 'travel'],
            ['name' => 'home-office'],
            ['name' => 'home-kitchen'],
            ['name' => 'home-decor'],
        ];


        foreach ($categories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'slug' => Str::slug($categoryData['name']),
            ]);
        }

        $this->command->info('Categories seeded!');
    }
}