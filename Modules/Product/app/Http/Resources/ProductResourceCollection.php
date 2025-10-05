<?php

namespace Modules\Product\Http\Resources;


use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Collection;

class ProductResourceCollection extends ResourceCollection
{

    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function toArray($request)
    {
        return $this->resource->toArray($request);
    }

}