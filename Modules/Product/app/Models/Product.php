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
use Illuminate\Support\Facades\Log;
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
        'discount_type',
        'discount_value',
        'quantity',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_value' => 'decimal:2',
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

    public function taxonomies(): BelongsToMany
    {
        return $this->belongsToMany(Taxonomy::class, 'product_taxonomies')->withTimestamps();
    }

    public function productTaxonomies()
    {
        return $this->hasMany(ProductTaxonomy::class);
    }


    // filters

    public function scopeIsActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }


    public function scopeFilterByName(Builder $query, string $name): Builder
    {
        Log::info("Filtering by name", ['name' => $name]);
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

    public function scopeByCategory(Builder $query, int $id): Builder
    {
        return $query;
    }

    public function scopeByCategories(Builder $query, array $ids): Builder
    {
        return $query->whereHas('categories', function (Builder $q) use ($ids) {
            $q->whereIn('categories.id', $ids);
        });
    }

    public function scopeByAllCategories(Builder $query, array $ids): Builder
    {
        foreach ($ids as $id) {
            $query->whereHas('categories', fn($q) => $q->where('categories.id', $id));
        }
        return $query;
    }

    public function scopeByBrand(Builder $query, int $ud): Builder
    {
        return $query->where('brand_id', $ud);
    }


}