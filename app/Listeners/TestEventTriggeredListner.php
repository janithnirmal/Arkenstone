<?php

namespace App\Listeners;

use App\Events\TestEventTriggered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class TestEventTriggeredListner
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TestEventTriggered $event): void
    {
        Log::info('TestEventTriggered event received', ['user_id' => $event->user?->id ?? 0]);
    }
}
