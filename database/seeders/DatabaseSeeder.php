<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
                // User
            PermissionSeeder::class,
            UserSeeder::class,

                // file and folders
            FolderSeeder::class,
            FileSeeder::class,

            // Shop Seeders
            VariationSeeder::class,
            VariationOptionSeeder::class,
            CategorySeeder::class,
            TestProductDataSeeder::class,
            ProductImageSeeder::class,
            // StorageDataSeeder::class,

            // Blog Seeders
            BlogSeeder::class,
        ]);
    }
}
