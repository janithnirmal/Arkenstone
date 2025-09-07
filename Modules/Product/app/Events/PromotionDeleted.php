<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\PromotionContract;

class PromotionDeleted
{
    use Dispatchable, SerializesModels;

    /**
     * The promotion instance that was deleted.
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

        Log::info("Promotion Deleted Event: A promotion was soft-deleted.", [
            'promotion_id' => $this->promotion->id,
            'title' => $this->promotion->title,
        ]);

        // Possible Listeners for this event:
        // - A listener to clear relevant caches.
        // - A listener to log the deletion action.
    }
}