<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin \Modules\Product\Models\ProductImage
 */
class ProductImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * This resource formats a ProductImage, with a key enhancement:
     * It transforms the stored relative 'path' into a full, absolute URL.
     * The frontend should not need to know or care about your storage configuration (e.g., S3, local disk).
     * This resource provides a ready-to-use URL for an `<img>` tag's src attribute.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Ensure you have a 'products' disk configured in 'config/filesystems.php'
        // and that its 'url' option is set correctly.
        $disk = 'public'; // or 's3', 'products', etc.

        return [
            'id' => $this->id,
            'url' => Storage::disk($disk)->url($this->path),
            'alt_text' => $this->alt_text,
            'is_primary' => (bool) $this->is_primary,
        ];
    }
}