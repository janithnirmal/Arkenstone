<?php

namespace Modules\Product\Events;


use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\ProductContract;

class ProductViewed
{
    use Dispatchable, SerializesModels;

    public $product;

    /**
     * Create a new event instance.
     */
    public function __construct(ProductContract $product) // Use the contract!
    {
        Log::info("ProductViewed event created!");
        $this->product = $product;
    }



}
