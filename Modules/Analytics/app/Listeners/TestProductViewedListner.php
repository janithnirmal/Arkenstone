<?php

namespace Modules\Analytics\Listeners;

use Modules\Product\Events\ProductViewed;

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
