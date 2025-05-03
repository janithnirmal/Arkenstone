<?php

namespace Database\Seeders;

use App\Models\Variation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VariationSeeder extends Seeder
{

    private $variations = [
        'Weight',
        'Capacity',
        'Size',
        'Color',
        'Material',
    ];  
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Variation::factory()->count(10)->create();


        foreach ($this->variations as $variation) {
            Variation::create([
                'name' => $variation,
            ]);
        }
    }
}
