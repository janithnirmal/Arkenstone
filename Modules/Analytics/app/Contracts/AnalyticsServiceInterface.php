<?php

namespace Modules\Analytics\Contracts;

interface AnalyticsServiceInterface
{
    public function recordSystemEvent(string $eventKey, array $payload = []): void;
    public function recordUserEvent(int $userId, string $eventKey, array $payload = []): void;

}