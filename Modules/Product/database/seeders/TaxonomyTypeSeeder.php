<?php

namespace Modules\Product\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Product\Models\TaxonomyType;

class TaxonomyTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // If you want to keep the predefined list, seed it first (optional)
        $preset = [
            ['name' => 'Product Category', 'slug' => 'product-category', 'description' => 'Hierarchical product classification'],
            ['name' => 'Product Tag', 'slug' => 'product-tag', 'description' => 'Flat labels for products'],
            ['name' => 'Material', 'slug' => 'material', 'description' => 'Composition information'],
            ['name' => 'Style', 'slug' => 'style', 'description' => 'Style or theme labels'],
            ['name' => 'Color Family', 'slug' => 'color-family', 'description' => 'Color groupings'],
            ['name' => 'Size Group', 'slug' => 'size-group', 'description' => 'Size scale definitions'],
            ['name' => 'Target', 'slug' => 'target', 'description' => 'Target audience'],
            ['name' => 'Season', 'slug' => 'season', 'description' => 'Seasonal grouping'],
            ['name' => 'Occasion', 'slug' => 'occasion', 'description' => 'Occasion classification'],
            ['name' => 'Feature', 'slug' => 'feature', 'description' => 'Special product features'],
        ];

        foreach ($preset as $row) {
            TaxonomyType::firstOrCreate(['slug' => $row['slug']], $row);
        }

        $existing = TaxonomyType::count();
        $needed = max(0, 50 - $existing);

        if ($needed > 0) {
            \Modules\Product\Database\Factories\TaxonomyTypeFactory::new()->count($needed)->create();
        }

        $this->command->info("taxonomy types created: $needed");
    }
}
