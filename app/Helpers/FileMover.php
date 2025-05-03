<?php
namespace App\Helpers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FileMover
{

    public function move($fromDisk, $deletePath, $sourceFolder, $destinationFolder)
    {
        Log::info("Moving files from " . $fromDisk);
        // delete images in storage
        Storage::disk($fromDisk)->delete(Storage::disk($fromDisk)->allFiles($deletePath));

        // move assets to asset folder
        $diskData = Storage::disk("data");
        $destinationFolder = storage_path($destinationFolder);

        foreach ($diskData->allFiles($sourceFolder) as $file) {
            // if path not exists create it
            if (!File::exists($destinationFolder)) {
                File::makeDirectory($destinationFolder, 0777, true, true);
            }
            File::copy($diskData->path($file), $destinationFolder . basename($file));
        }
    }

}