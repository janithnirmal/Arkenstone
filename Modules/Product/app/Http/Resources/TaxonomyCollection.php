<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class TaxonomyCollection extends ResourceCollection
{
    public $collects = TaxonomyResource::class;

    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}