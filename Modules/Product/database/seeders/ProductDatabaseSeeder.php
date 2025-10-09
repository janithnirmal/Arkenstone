<?php

namespace Modules\Product\Database\Seeders;

use Illuminate\Database\Seeder;

class ProductDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            CategorySeeder::class,
            BrandSeeder::class,
            AttributeSeeder::class,
            ProductSeeder::class,
            PromotionSeeder::class,
            TaxonomyTypeSeeder::class,
            TaxonomySeeder::class,
        ]);
    }
}