<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


/**
 * ----------------------------------------------------------------------
 * Backup command Configuration
 * ----------------------------------------------------------------------
 * Schedule the backup commands.
 * You don't need to worry about the timing, as it's already set to run daily.
 * You can adjust the timing by changing the `at` method's argument.
 * You can also change the frequency by using different scheduling methods, such as `hourly()`, `weekly()`, etc.
 * You don't need to run manual backups, as the scheduler will take care of it.
 * Currently these commands are scheduled: only database backups
 * if you want to fully project backups, you need to uncomment the following line:
 * Step 1: uncomment the base_path() in the backup.php config file
 * Step 2: uncomment the backup:run --only-db command
 */
Schedule::command('backup:clean')->daily()->at('01:00');
Schedule::command('backup:run')->daily()->at('01:30');
//Schedule::command('backup:run --only-db')->daily()->at('01:30'); 