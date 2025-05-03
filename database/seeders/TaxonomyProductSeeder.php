<?php

namespace Database\Seeders;

use App\Models\TaxonomyProduct;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaxonomyProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TaxonomyProduct::factory()->count(10)->create();
    }
}
