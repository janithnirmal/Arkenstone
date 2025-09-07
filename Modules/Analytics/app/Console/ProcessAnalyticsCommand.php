<?php

namespace Modules\Analytics\Console;

use Illuminate\Console\Command;
use Modules\Analytics\Services\AnalyticsRunnerService;

class ProcessAnalyticsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * We define the '--user' option directly here. It's a boolean flag.
     * The description after the colon will appear in the help menu.
     */
    protected $signature = 'analytics:process 
                            {--user : Process user specific analytics instead of system-wide ones.}';

    /**
     * The console command description.
     */
    protected $description = 'Process raw analytics data into processed, queryable files.';

    /**
     * Execute the console command.
     *
     * We inject the runner service and then check for the '--user' option
     * to decide which analysis method to call.
     *
     * @param AnalyticsRunnerService $runner
     * @return int
     */
    public function handle(AnalyticsRunnerService $runner): int
    {
        // Check if the '--user' flag was passed when the command was run.
        if ($this->option('user')) {
            $this->info('Starting user specific analytics processing...');
            $runner->runUserAnalyzers();

        } else {
            $this->info('Starting system-wide analytics processing...');

            // This is the default behavior when no option is provided.
            $runner->runSystemAnalyzers();
        }

        $this->info('Analytics processing complete.');

        return self::SUCCESS;
    }
}