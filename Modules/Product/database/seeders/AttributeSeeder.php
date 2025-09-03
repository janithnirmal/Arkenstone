<?php

namespace Modules\Product\Database\Seeders;

use Modules\Product\Models\Attribute;
use Illuminate\Database\Seeder;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Attribute::truncate(); // Clear existing attributes and their values via cascade

        $color = Attribute::create(['name' => 'Color']);
        $color->values()->createMany([
            ['value' => 'Red'],
            ['value' => 'Blue'],
            ['value' => 'Green'],
            ['value' => 'Black'],
            ['value' => 'White'],
        ]);

        $size = Attribute::create(['name' => 'Size']);
        $size->values()->createMany([
            ['value' => 'Small'],
            ['value' => 'Medium'],
            ['value' => 'Large'],
            ['value' => 'XL'],
        ]);

        $material = Attribute::create(['name' => 'Material']);
        $material->values()->createMany([
            ['value' => 'Cotton'],
            ['value' => 'Polyester'],
            ['value' => 'Leather'],
        ]);

        $this->command->info('Attributes and AttributeValues seeded!');
    }
}