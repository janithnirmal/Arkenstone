<?php

namespace Modules\Product\Events;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class StockUpdated
{
    use Dispatchable, SerializesModels;

    public Model $stockable;
    public int $oldStock;
    public int $newStock;

    /**
     * Create a new event instance.
     *
     * @param \Illuminate\Database\Eloquent\Model $stockable The product or variant being updated.
     * @param int $oldStock The stock quantity before the update.
     * @param int $newStock The new stock quantity.
     */
    public function __construct(Model $stockable, int $oldStock, int $newStock)
    {
        $this->stockable = $stockable;
        $this->oldStock = $oldStock;
        $this->newStock = $newStock;

        Log::info("Stock Updated Event: Stock level changed.", [
            'model_type' => get_class($this->stockable),
            'model_id' => $this->stockable->id,
            'sku' => $this->stockable->sku ?? 'N/A',
            'old_stock' => $this->oldStock,
            'new_stock' => $this->newStock,
        ]);

        // Possible Listeners for this event:
        // - A listener to send a "low stock" notification to an admin.
        // - A listener to notify a back-office inventory management system.
        // - A listener to trigger a "back in stock" notification for subscribed customers.
    }
}