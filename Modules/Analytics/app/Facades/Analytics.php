<?php

namespace Modules\Analytics\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static void recordSystemEvent(string $eventType, array $payload = [])
 * @method static void recordUserEvent(int $userId, string $eventType, array $payload = [])
 */
class Analytics extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'analytics';
    }
}