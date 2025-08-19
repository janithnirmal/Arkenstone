<?php

namespace Modules\Product\Listeners;

use Modules\Product\Events\ProductViewed;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class TestProductViewedListner
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(ProductViewed $event): string
    {
        return $event->product->getName();
    }
}
