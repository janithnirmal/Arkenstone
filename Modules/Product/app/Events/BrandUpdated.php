<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\BrandContract;

class BrandUpdated
{
    use Dispatchable, SerializesModels;

    public BrandContract $brand;

    /**
     * Create a new event instance.
     */
    public function __construct(BrandContract $brand)
    {
        $this->brand = $brand;
        Log::info("Brand Updated Event: A brand was updated.", ['id' => $brand->id, 'name' => $brand->name]);
    }
}