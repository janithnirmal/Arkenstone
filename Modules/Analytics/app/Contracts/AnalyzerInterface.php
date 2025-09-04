<?php

namespace Modules\Analytics\Contracts;

interface AnalyzerInterface
{
    /**
     * A unique key for this analysis, used for file naming.
     * @return string
     */
    public function key(): string;

    /**
     * The type of analysis: 'system' or 'user'.
     * @return string
     */
    public function type(): string;

    /**
     * Perform the analysis and save the result.
     * @param int|null $userId The user ID if type is 'user'.
     */
    public function analyze(?int $userId = null): void;
}