<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Core\Contracts\ProductVariantContract;
use Modules\Product\Models\AttributeValue; 

class ProductVariant extends Model implements ProductVariantContract
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'name',
        'sku',
        'price',
        'discount_price',
        'stock',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the product that owns the variant.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the attribute values for the variant.
     */
    public function attributeValues(): BelongsToMany
    {
        return $this->belongsToMany(AttributeValue::class, 'product_variant_attribute_values');
    }

    /**
     * Accessor to get the combined attribute name (e.g., "Color: Red, Size: Large")
     */
    public function getAttributeComboNameAttribute(): string
    {
        return $this->attributeValues->map(function ($value) {
            return "{$value->attribute->name}: {$value->value}";
        })->implode(', ');
    }
}