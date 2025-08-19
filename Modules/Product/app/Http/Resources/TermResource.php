<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \Modules\Product\Models\Term
 */
class TermResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * This resource formats a single taxonomy Term (e.g., 'Cotton', 'Summer 2025').
     * The parent Taxonomy information (e.g., 'Material') is already provided as the key
     * in the parent `ProductResource`, so we don't need to repeat it here.
     * This keeps the overall API response cleaner and more efficient (DRY).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
        ];
    }
}