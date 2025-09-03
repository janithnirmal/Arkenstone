<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function ($product) use ($request) {
                // Ensure primaryImage is eager loaded or handled to avoid N+1
                return (new ProductResource($product))->toArray($request);
            }),
            'links' => [
                'self' => $request->fullUrl(),
            ],
        ];
    }
}