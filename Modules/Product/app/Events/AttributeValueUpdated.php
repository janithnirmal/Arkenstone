<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\AttributeValueContract;

class AttributeValueUpdated
{
    use Dispatchable, SerializesModels;

    public AttributeValueContract $attributeValue;

    /**
     * Create a new event instance.
     */
    public function __construct(AttributeValueContract $attributeValue)
    {
        $this->attributeValue = $attributeValue;
        Log::info("AttributeValue Updated Event: A attributeValue was updated.", ['id' => $attributeValue->id, 'name' => $attributeValue->name]);
    }
}