<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\ProductContract;

class ProductUpdated
{
    use Dispatchable, SerializesModels;

    public ProductContract $product;

    /**
     * Create a new event instance.
     */
    public function __construct(ProductContract $product)
    {
        $this->product = $product;
        Log::info("Product Updated Event: A product was updated.", ['id' => $product->id, 'name' => $product->name]);
    }
}