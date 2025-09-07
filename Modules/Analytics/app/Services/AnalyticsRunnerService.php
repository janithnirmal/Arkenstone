<?php

namespace Modules\Analytics\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AnalyticsRunnerService
{
    /**
     * @var iterable<\Modules\Core\Contracts\Analytics\AnalyzerInterface>
     */
    private $analyzers;

    /**
     * The service container will automatically inject an array of all
     * instances tagged with 'analyzers' into this constructor.
     */
    public function __construct(iterable $analyzers)
    {
        $this->analyzers = $analyzers;
    }

    /**
     * Run all available system-level analyses.
     */
    public function runSystemAnalyzers(): void
    {
        foreach ($this->analyzers as $analyzer) {
            if ($analyzer->type() === 'system') {
                $analyzer->analyze();
            }
        }
    }

    /**
     * Run all available user-level analyses for a specific user.
     */
    public function runUserAnalyzers(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            foreach ($this->analyzers as $analyzer) {
                if ($analyzer->type() === 'user') {
                    $analyzer->analyze($$user->id);
                }
            }
        }
    }
}