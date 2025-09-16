<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // When using `loadMissing`, relations are only loaded if they haven't been already.
        // This is good for preventing N+1 queries in some scenarios.
        $this->loadMissing(['brand', 'categories', 'images']);

        $data = [
            'id' => $this->id,
            'brand_id' => $this->brand_id,
            'name' => $this->name,
            'description' => $this->description,
            'sku' => $this->sku,
            'price' => (float) $this->price,
            'discount_price' => (float) $this->discount_price,
            'quantity' => (int) $this->stock,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'brand' => $this->whenLoaded('brand', function () {
                return new BrandResource($this->brand); // Create a BrandResource if needed
            }),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')), // Create a CategoryResource if needed
            'images' => ProductImageResource::collection($this->whenLoaded('images')), // Create a ProductImageResource
            'primary_image_url' => $this->primaryImage?->url, // Assuming a primaryImage relationship on Product model
            'final_price' => $this->discount_price > 0 ? (float) $this->discount_price : (float) $this->price, // Calculate final price
        ];

        // Filter out null values for nullable fields if they are not set
        return array_filter($data, fn($value) => !is_null($value));
    }
}