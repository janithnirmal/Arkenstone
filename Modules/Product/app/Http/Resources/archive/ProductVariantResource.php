<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $this->loadMissing('attributeValues.attribute'); // Ensure nested attributes are loaded

        $data = [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'name' => $this->name, // e.g., "Red, Large"
            'sku' => $this->sku,
            'price' => (float) $this->price,
            'discount_price' => (float) $this->discount_price,
            'stock' => (int) $this->stock,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'attribute_values' => AttributeValueResource::collection($this->whenLoaded('attributeValues')), // Create this resource
            'final_price' => $this->discount_price > 0 ? (float) $this->discount_price : (float) $this->price, // Calculate final price
        ];

        return array_filter($data, fn ($value) => !is_null($value));
    }
}