<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'in_stock' => $this->isInStock(),
            'thumbnail_url' => $this->thumbnail_url,
            'relationships' => [
                'categories' => CategoryResource::collection($this->whenLoaded('categories')),
                'images' => ProductImageResource::collection($this->whenLoaded('images')),
                // Group terms by their taxonomy for a structured response
                'taxonomies' => $this->whenLoaded('terms', function () {
                    return $this->terms->groupBy('taxonomy.name')->map(function ($terms) {
                        return TermResource::collection($terms);
                    });
                }),
            ],
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}