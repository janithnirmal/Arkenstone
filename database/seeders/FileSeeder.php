<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // copy all the files and folders from data storage to public storage
        $dataStoragePath = Storage::disk('data')->path('');
        $publicStoragePath = Storage::disk('public')->path('');

        if (File::exists($dataStoragePath)) {
            File::copyDirectory($dataStoragePath, $publicStoragePath);
        }
    }
}
