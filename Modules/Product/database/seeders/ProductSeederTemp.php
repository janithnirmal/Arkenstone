<?php

namespace Modules\Product\Database\Seeders;

use Modules\Product\Models\Product;
use Illuminate\Database\Seeder;


class ProductSeederTemp extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::factory()->count(50)->create();
    }
}