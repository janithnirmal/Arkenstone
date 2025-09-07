<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Your existing backup schedule
        Schedule::command('backup:clean')->daily()->at('01:00');
        Schedule::command('backup:run')->daily()->at('01:30');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }

    /**
     * The Artisan commands provided by your application.
     */
    protected $commands = [
        \App\Console\Commands\Audit\TestAuditLogging::class,
        \App\Console\Commands\Audit\AdvanceAuditMiddlewareTest::class,
        \App\Console\Commands\Audit\ShowAuditStats::class,
        \App\Console\Commands\Audit\TestAuditMiddleware::class,
        \App\Console\Commands\Audit\ClearAuditLogs::class,
    ];
}