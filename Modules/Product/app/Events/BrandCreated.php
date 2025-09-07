<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\BrandContract;

class BrandCreated
{
    use Dispatchable, SerializesModels;

    public BrandContract $brand;

    /**
     * Create a new event instance.
     */
    public function __construct(BrandContract $brand)
    {
        $this->brand = $brand;
        Log::info("Brand Created Event: A new brand was created.", ['id' => $brand->id, 'name' => $brand->name]);
    }
}