<?php

namespace Modules\Product\Events;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\ProductContract;

class ProductImagesUploaded
{
    use Dispatchable, SerializesModels;

    public ProductContract $product;
    public Collection $images;

    /**
     * Create a new event instance.
     */
    public function __construct(ProductContract $product, Collection $images)
    {
        $this->product = $product;
        $this->images = $images;

        Log::info("Product Images Uploaded Event: {$images->count()} images were added.", [
            'product_id' => $product->id,
            'image_ids' => $images->pluck('id')->toArray()
        ]);
    }
}