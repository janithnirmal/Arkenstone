<?php

namespace Modules\Product\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

use Modules\Core\Contracts\Products\ProductContract;


class Product extends Model implements ProductContract
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'brand_id',
        'name',
        'slug',
        'description',
        'sku',
        'price',
        'discount_price',
        'quantity',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the brand that owns the product.
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get the categories that belong to the product.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }


    /**
     * Get the images for the product.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Get the primary image for the product.
     */
    public function primaryImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true)->orderBy('id');
    }


    public function scopeIsActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }


    public function scopeFilterByName(Builder $query, string $name): Builder
    {
        return $query->where('name', 'like', '%' . $name . '%');
    }

    public function scopeMinPrice(Builder $query, float $price): Builder
    {
        return $query->where('price', '>=', $price);
    }

    public function scopeMaxPrice(Builder $query, float $price): Builder
    {
        return $query->where('price', '<=', $price);
    }

    public function scopeByCategory(Builder $query, string $slug): Builder
    {
        return $query->whereHas('categories', function (Builder $q) use ($slug) {
            $q->where('slug', $slug);
        });
    }
}