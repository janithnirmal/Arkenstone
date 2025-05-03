<?php

namespace Database\Seeders;

use App\Models\Taxonomy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TaxonomySeeder extends Seeder
{

    private array $taxonomyNames = [
        'sub_category',
        'country',
        'adult_only'
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Taxonomy::factory()->count(10)->create();

        foreach ($this->taxonomyNames as $taxonomyName) {
            Taxonomy::create([
                'name' => $taxonomyName,
                'slug' => Str::slug($taxonomyName),
            ]);
        }
    }
}
