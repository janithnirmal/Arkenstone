<?php

namespace Modules\Product\Http\Resources;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Product\Enum\DiscountType;

class ProductResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {


        return [
            'id' => $this->id,
            'brand_id' => $this->brand_id,
            'name' => $this->name,
            'description' => $this->description,
            'sku' => $this->sku,

            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),

            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'brand' => new BrandResource($this->whenLoaded('brand')),

            'images' => ProductImageResource::collection($this->whenLoaded('images')),

            'price' => (float) $this->price,
            'discount_type' => (float) $this->discount_type,
            'discount_value' => (float) $this->discount_value,
            'quantity' => (int) $this->stock,

            'taxonomies' => TaxonomyResource::collection($this->whenLoaded('taxonomies')),
            

            'final_price' => $this->discount_type === DiscountType::PERCENTAGE->value ? round(((float) $this->price / 100) * (float) $this->discount_value, 2) : (float) $this->price - (float) $this->discount_value,
        ];
    }
}