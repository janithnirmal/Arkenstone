<?php

namespace Modules\Analytics\Services\Analyzers;

use Carbon\Carbon;
use Modules\Analytics\Helpers\AnalyticsStorage;
use Modules\Analytics\Contracts\AnalyzerInterface;

class TestButtonClickedAnalyzer implements AnalyzerInterface
{
    protected $storage;

    public function __construct(AnalyticsStorage $storage)
    {
        $this->storage = $storage;
    }

    /**
     * The unique key. It's now more generic as it's not just for comparisons.
     */
    public function key(): string
    {
        return 'test_button_clicked';
    }

    /**
     * The type remains 'company'.
     */
    public function type(): string
    {
        return 'system';
    }

    /**
     * The simplified analysis logic.
     * It now only calculates a simple count of page views for each day.
     */
    public function analyze(?int $companyId = null): void
    {
        // 1. Get the raw page_view events for the specific company.
        $rawEvents = $this->storage->getRawEvents("system/{$companyId}/raw", 'test_button_clicked');

        // 2. Group the events by date and count them.
        $pageViewsByDay = collect($rawEvents)
            ->countBy(function ($event) {
                return Carbon::parse($event['timestamp'])->format('Y-m-d');
            })
            ->sortKeys(); // Sort by date for clean, ordered data.

        // 3. Save the processed data. The result is a simple object like:
        // { "2023-10-25": 10, "2023-10-26": 25, "2023-10-27": 15 }
        $this->storage->saveProcessedData("system/{$companyId}/processed", $this->key(), $pageViewsByDay->all());
    }
}