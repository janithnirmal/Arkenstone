<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            // 'id' => $this->id,
            'product_id' => $this->product_id,
            'url' => url(Storage::url($this->url)), 
            'alt_text' => $this->alt_text,
            'is_primary' => (bool) $this->is_primary,
            'order' => (int) $this->order,
        ];
    }
}