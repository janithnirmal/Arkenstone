<?php

namespace Modules\Product\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Product\Database\Factories\TaxonomyFactory;
use Modules\Product\Models\TaxonomyType;

class TaxonomySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
  
        $created = 0;
        $target = 50;

        // Track created taxonomies grouped by type for parent assignment.
        $byType = [];

        while ($created < $target) {
            $type = TaxonomyType::query()->inRandomOrder()->first();

            // 30% chance to pick a parent from same type if any exist.
            $parentId = null;
            if (!empty($byType[$type->id]) && rand(1, 100) <= 30) {
                $parentId = collect($byType[$type->id])->random();
            }

            $taxonomy = TaxonomyFactory::new()->create([
                'taxonomy_type_id' => $type->id,
                'parent_id' => $parentId,
            ]);
            

            $byType[$type->id][] = $taxonomy->id;
            $created++;
        }

        $this->command->info("taxonomies created: $created");
    }
}
