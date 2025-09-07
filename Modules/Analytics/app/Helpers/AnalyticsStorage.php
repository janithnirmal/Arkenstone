<?php

namespace Modules\Analytics\Helpers;

use Illuminate\Support\Facades\File;

/**
 * Manages all file system interactions for the analytics system.
 */
class AnalyticsStorage
{
    const BASE_PATH = 'analytics';

    /**
     * Appends an event to a raw JSON file.
     *
     * @param string $path The sub-path for the file (e.g., 'system/raw').
     * @param string $eventKey The name of the event file (e.g., 'user_logins').
     * @param array $data The data to record.
     */
    public function appendRawEvent(string $path, string $eventKey, array $data): void
    {
        $fullPath = storage_path('app/' . self::BASE_PATH . '/' . $path);
        File::ensureDirectoryExists($fullPath);

        $filePath = $fullPath . '/' . $eventKey . '.json';
        $events = $this->readJsonFile($filePath);
        $events[] = $data;

        File::put($filePath, json_encode(value: $events, flags: JSON_PRETTY_PRINT));
    }

    /**
     * Overwrites a processed JSON file with new analysis data.
     *
     * @param string $path The sub-path for the file (e.g., 'system/processed').
     * @param string $analyzerKey The key of the analyzer.
     * @param array $data The processed data.
     */
    public function saveProcessedData(string $path, string $analyzerKey, array $data): void
    {
        $fullPath = storage_path('app/' . self::BASE_PATH . '/' . $path);
        File::ensureDirectoryExists($fullPath);
        $filePath = $fullPath . '/' . $analyzerKey . '.json';
        File::put($filePath, json_encode($data, JSON_PRETTY_PRINT));
    }

    /**
     * Reads raw event data from a JSON file.
     *
     * @param string $path The sub-path for the file.
     * @param string $eventKey The name of the event file.
     * @return array
     */
    public function getRawEvents(string $path, string $eventKey): array
    {
        $filePath = storage_path('app/' . self::BASE_PATH . '/' . $path . '/' . $eventKey . '.json');
        return $this->readJsonFile($filePath);
    }

    /**
     * Reads processed data from a JSON file.
     *
     * @param string $path The sub-path for the file.
     * @param string $analyzerKey The key of the analyzer.
     * @return array|null
     */
    public function getProcessedData(string $path, string $analyzerKey): ?array
    {
        $filePath = storage_path('app/' . self::BASE_PATH . '/' . $path . '/' . $analyzerKey . '.json');
        return File::exists($filePath) ? $this->readJsonFile($filePath) : null;
    }

    /**
     * Helper to read and decode a JSON file.
     */
    private function readJsonFile(string $filePath): array
    {
        if (!File::exists($filePath)) {
            return [];
        }
        return json_decode(File::get($filePath), true) ?? [];
    }
}