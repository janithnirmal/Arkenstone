<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class FolderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create a folder if not exists - form_assets
        if (!File::exists(storage_path('app/private/form_assets/'))) {
            File::makeDirectory(storage_path('app/private/form_assets/'));
        }

        // create a file if not exists

    }
}
