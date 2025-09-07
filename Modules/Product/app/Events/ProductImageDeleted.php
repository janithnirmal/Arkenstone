<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\ProductImageContract;

class ProductImageDeleted
{
    use Dispatchable, SerializesModels;

    /**
     * The product image instance that was deleted.
     *
     * Note: We use the model directly here because after deletion,
     * we might need access to its original attributes (like product_id)
     * which are still available on the model object in memory.
     */
    public ProductImageContract $image;

    /**
     * Create a new event instance.
     *
     * @param \Modules\Core\Contracts\ProductImageContract $image
     * @return void
     */
    public function __construct(ProductImageContract $image)
    {
        $this->image = $image;

        Log::info("Product Image Deleted Event: An image was deleted.", [
            'image_id' => $this->image->id,
            'product_id' => $this->image->product_id, // Useful for context
            'path' => $this->image->getUrl(), // The relative path of the deleted file
        ]);

        // You could add listeners to this event to:
        // - Clear specific image caches.
        // - Notify an external digital asset management (DAM) system.
        // - Update a search index to remove the image URL.
    }
}