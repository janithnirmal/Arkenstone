<?php

namespace Modules\Taxonomy\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class TaxonomyTypeCollection extends ResourceCollection
{
    public $collects = TaxonomyTypeResource::class;

    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}