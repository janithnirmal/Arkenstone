<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\AttributeContract;

class AttributeViewed
{
    use Dispatchable, SerializesModels;

    public AttributeContract $attribute;

    /**
     * Create a new event instance.
     */
    public function __construct(AttributeContract $attribute)
    {
        $this->attribute = $attribute;
        Log::info("Attribute Viewed Event: A attribute was viewed.", ['id' => $attribute->id, 'name' => $attribute->name]);
    }
}