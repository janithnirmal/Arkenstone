<?php
namespace Modules\Product\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TaxonomyResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                => $this->id,
            'taxonomy_type_id'  => $this->taxonomy_type_id,
            'parent_id'         => $this->parent_id,
            'name'              => $this->name,
            'slug'              => $this->slug,
            'description'       => $this->description,
            'sort_order'        => $this->sort_order,
            'meta'              => $this->meta,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,

            // relations (optional when eager loaded)
            'type'              => new TaxonomyTypeResource($this->whenLoaded('type')),
            'parent'            => new TaxonomyResource($this->whenLoaded('parent')),
            'children'          => TaxonomyResource::collection($this->whenLoaded('children')),
        ];
    }
}