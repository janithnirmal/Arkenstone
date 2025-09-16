<?php

namespace Modules\Product\Database\Seeders;

use Modules\Product\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Brand::truncate(); // Clear existing brands

        $brands = [
            "Stylo",
            "Denim Co.",
            "Outdoor Pro",
            "Techtron",
            "InnoWork",
            "AudioPhile",
            "GameOn",
            "Urban Tread",
            "Rugged Gear",
            "ErgoLiving",
            "BrewMaster",
            "Glow",
            "Page Turner Inc.",
        ];

        foreach ($brands as $brandName) {
            Brand::create([
                'name' => $brandName,
                'slug' => Str::slug($brandName),
                // 'logo' => 'https://via.placeholder.com/150/0000FF/FFFFFF?text=' . urlencode($brandName), // Example logo
            ]);
        }

        $this->command->info('Brands seeded!');
    }
}