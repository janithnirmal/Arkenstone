<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Category::factory()->count(5)->create();


        // delete images in storage
        Storage::disk("categories")->delete(Storage::disk("categories")->allFiles());

        // add new seed data
        $categories = json_decode(file_get_contents(database_path('data/shop/categories.json')), true);

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => $category['slug'],
                'image' => $category['image'],
            ]);
        }

        // copy images
        $diskData = Storage::disk("data");
        $sourceFolder = "images/categories/";
        $destinationFolder = storage_path("app/public/images/categories/");

        foreach ($diskData->allFiles($sourceFolder) as $file) {
            File::copy($diskData->path($file), $destinationFolder . basename($file));
        }
    }
}
