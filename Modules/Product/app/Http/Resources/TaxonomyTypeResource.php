<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TaxonomyTypeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'description' => $this->description,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,

            // relations (optional when eager loaded)
            'taxonomies'  => TaxonomyResource::collection($this->whenLoaded('taxonomies')),
        ];
    }
}