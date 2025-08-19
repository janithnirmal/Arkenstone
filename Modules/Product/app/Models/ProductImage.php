<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Product\Database\Factories\ProductImageFactory;
use Modules\Product\Models\Product;



class ProductImage extends Model
{
    /** @use HasFactory<Modules\Product\Database\Factories\ProductImageFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['product_id', 'path', 'alt_text', 'is_primary'];
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    
    protected static function newFactory()
    {
        return ProductImageFactory::new();
    }
}
