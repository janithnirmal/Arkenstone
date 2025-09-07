<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\AttributeValueContract;

class AttributeValueViewed
{
    use Dispatchable, SerializesModels;

    public AttributeValueContract $attributeValue;

    /**
     * Create a new event instance.
     */
    public function __construct(AttributeValueContract $attributeValue)
    {
        $this->attributeValue = $attributeValue;
        Log::info("AttributeValue Viewed Event: A attributeValue was viewed.", ['id' => $attributeValue->id, 'name' => $attributeValue->name]);
    }
}