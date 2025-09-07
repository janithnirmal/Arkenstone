<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\PromotionContract;

class PromotionUpdated
{
    use Dispatchable, SerializesModels;

    /**
     * The promotion instance that was updated.
     */
    public PromotionContract $promotion;

    /**
     * Create a new event instance.
     *
     * @param \Modules\Core\Contracts\PromotionContract $promotion
     * @return void
     */
    public function __construct(PromotionContract $promotion)
    {
        $this->promotion = $promotion;

        Log::info("Promotion Updated Event: A promotion was updated.", [
            'promotion_id' => $this->promotion->id,
            'title' => $this->promotion->title,
        ]);

        // Possible Listeners for this event:
        // - A listener to clear caches related to the specific product/category/brand.
        // - A listener to log the changes (what was changed, by whom, etc.).
    }
}