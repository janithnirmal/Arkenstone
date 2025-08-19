<?php

namespace Modules\Product\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Product\Models\Category;
use Modules\Product\Models\Product;
use Modules\Product\Models\Taxonomy;
use Modules\Product\Models\Term;

class ProductDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $materialTaxonomy = Taxonomy::create(['name' => 'Material']);
        $collectionTaxonomy = Taxonomy::create(['name' => 'Collection']);

        // 2. Create Terms for each Taxonomy
        Term::create(['taxonomy_id' => $materialTaxonomy->id, 'name' => 'Cotton', 'slug' => 'cotton']);
        Term::create(['taxonomy_id' => $materialTaxonomy->id, 'name' => 'Leather', 'slug' => 'leather']);
        Term::create(['taxonomy_id' => $collectionTaxonomy->id, 'name' => 'Summer 2025', 'slug' => 'summer-2025']);
        Term::create(['taxonomy_id' => $collectionTaxonomy->id, 'name' => 'Winter Sale', 'slug' => 'winter-sale']);

        // 3. Create Categories
        Category::factory()->count(10)->create();

        // 4. Create Products (the factory will auto-attach relationships)
        Product::factory()->count(50)->create();
    }
}
