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

        ]);
    }
}
