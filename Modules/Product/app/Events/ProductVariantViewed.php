<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\ProductVariantContract;

class ProductVariantViewed
{
    use Dispatchable, SerializesModels;

    public ProductVariantContract $productVariant;

    /**
     * Create a new event instance.
     */
    public function __construct(ProductVariantContract $productVariant)
    {
        $this->productVariant = $productVariant;
        Log::info("ProductVariant Viewed Event: A productVariant was viewed.", ['id' => $productVariant->id, 'name' => $productVariant->name]);
    }
}