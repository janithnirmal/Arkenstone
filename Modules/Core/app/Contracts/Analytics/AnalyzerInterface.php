<?php

namespace Modules\Core\Contracts\Analytics;

interface AnalyzerInterface
{
    /**
     * A unique key for this analysis, used for file naming.
     * @return string
     */
    public function key(): string;

    /**
     * The type of analysis: 'system' or 'company'.
     * @return string
     */
    public function type(): string;

    /**
     * Perform the analysis and save the result.
     * @param int|null $companyId The company ID if type is 'company'.
     */
    public function analyze(?int $companyId = null): void;
}