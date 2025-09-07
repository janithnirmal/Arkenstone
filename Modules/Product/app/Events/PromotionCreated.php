<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\PromotionContract;

class PromotionCreated
{
    use Dispatchable, SerializesModels;

    /**
     * The promotion instance that was created.
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

        Log::info("Promotion Created Event: A new promotion was created.", [
            'promotion_id' => $this->promotion->id,
            'title' => $this->promotion->title,
            'type' => $this->promotion->type,
            'entity_id' => $this->promotion->entity_id,
            'discount_percent' => $this->promotion->discount_percent,
        ]);

        // Possible Listeners for this event:
        // - A listener to clear application-wide pricing or product caches.
        // - A listener to notify a marketing service about the new promotion.
        // - A listener to add this to an activity log for admins.
    }
}