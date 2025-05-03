<?php

namespace Database\Seeders;

use App\Models\Variation;
use App\Models\VariationOption;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VariationOptionSeeder extends Seeder
{

    private $variationOptions = [
        "Weight" => [
            "100g", // 1
            "200g", // 2
            "250g", // 3
            "500g", // 4
            "1kg", // 5
        ],
        "Capacity" => [
            "100ml", // 6
            "200ml", // 7
            "300ml", // 8
            "400ml", // 9
            "500ml", // 10
        ],
        "Size" => [
            "Small", // 11
            "Medium", // 12
            "Large", // 13
        ],
        "Color" => [
            "White", // 14
            "Brown", // 15
            "Red", // 16
            "Blue", // 17
            "Green", // 18
            "Yellow", // 19
            "Orange", // 20
        ],
        "Material" => [
            "Plastic", // 21
            "Metal", // 22
            "Glass", // 23
            "Paper", // 24
        ]
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // VariationOption::factory()->count(10)->create();

        foreach ($this->variationOptions as $variation => $options) {
            $variation = Variation::where('name', $variation)->first();
            foreach ($options as $option) {
                VariationOption::create([
                    'variation_id' => $variation->id,
                    'name' => $option,
                ]);
            }
        }

    }
}
