<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Core\Contracts\ProductImageContract;

class ProductImage extends Model implements ProductImageContract
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'url',
        'alt_text',
        'is_primary',
        'order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the product that owns the image.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the public URL of the image.
     *
     * @return string
     */
    public function getUrl(): string
    {
        return $this->url;
    }
}