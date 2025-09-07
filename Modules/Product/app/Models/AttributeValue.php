<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Core\Contracts\AttributeValueContract;

class AttributeValue extends Model implements AttributeValueContract
{
    use HasFactory;

    public $timestamps = false; // Attribute values themselves might not need timestamps

    protected $fillable = [
        'attribute_id',
        'value',
    ];

    /**
     * Get the attribute that owns the value.
     */
    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attribute::class);
    }

    /**
     * Get the product variants that use this attribute value.
     *  @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<\Modules\Product\Models\ProductVariant>
     */
    public function productVariants(): BelongsToMany
    {
        return $this->belongsToMany(ProductVariant::class, 'product_variant_attribute_values');
    }
}