<?php

namespace Modules\Analytics\Services\Analyzers;

use Modules\Analytics\Contracts\AnalyzerInterface;
use Modules\Analytics\Helpers\AnalyticsStorage;
use Carbon\Carbon;

class PlatformVisitsAnalyzer implements AnalyzerInterface
{
    protected $storage;

    public function __construct(AnalyticsStorage $storage)
    {
        $this->storage = $storage;
    }

    public function key(): string
    {
        return 'daily_user_visits';
    }

    public function type(): string
    {
        return 'system';
    }

    public function analyze(?int $companyId = null): void
    {
        $rawEvents = $this->storage->getRawEvents('system/raw', 'user_visit');

        $loginsByDay = collect($rawEvents)
            ->countBy(function ($event) {
                return Carbon::parse($event['timestamp'])->format('Y-m-d');
            })
            ->sortKeys();

        $this->storage->saveProcessedData('system/processed', $this->key(), $loginsByDay->all());
    }
}