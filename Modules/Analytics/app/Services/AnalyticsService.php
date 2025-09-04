<?php

namespace Modules\Analytics\Services;

use Modules\Analytics\Helpers\AnalyticsStorage;

/**
 * Track System wide Events and User Events and store the data in the file system in JSON format
 */
class AnalyticsService
{
    protected $storage;

    public function __construct(AnalyticsStorage $storage)
    {
        $this->storage = $storage;
    }

    /**
     * Records a system-wide event.
     *
     * @param string $eventKey The name of the event (e.g., 'user_registered').
     * @param array $payload Additional data for the event.
     */
    public function recordSystemEvent(string $eventKey, array $payload = []): void
    {
        $data = array_merge(['timestamp' => now()->toIso8601String()], $payload);
        $this->storage->appendRawEvent('system/raw', $eventKey, $data);
    }

    /**
     * Records an event specific to a user.
     *
     * @param int $userId The ID of the user.
     * @param string $eventKey The name of the event.
     * @param array $payload Additional data for the event.
     */
    public function recordUserEvent(int $userId, string $eventKey, array $payload = []): void
    {
        $data = array_merge(['timestamp' => now()->toIso8601String()], $payload);
        $this->storage->appendRawEvent("users/{$userId}/raw", $eventKey, $data);
    }
}