<?php

namespace Modules\Analytics\Services\Analyzers;


use Carbon\Carbon;
use Modules\Analytics\Helpers\AnalyticsStorage;
use Modules\Analytics\Contracts\AnalyzerInterface;

class DailyUserLoginsAnalyzer implements AnalyzerInterface
{
    protected $storage;

    public function __construct(AnalyticsStorage $storage)
    {
        $this->storage = $storage;
    }

    public function key(): string
    {
        return 'daily_user_logins';
    }

    public function type(): string
    {
        return 'system';
    }

    public function analyze(?int $companyId = null): void
    {
        $rawEvents = $this->storage->getRawEvents('system/raw', 'user_login');

        $loginsByDay = collect($rawEvents)
            ->countBy(function ($event) {
                return Carbon::parse($event['timestamp'])->format('Y-m-d');
            })
            ->sortKeys();

        $this->storage->saveProcessedData('system/processed', $this->key(), $loginsByDay->all());
    }
}