<?php

namespace Modules\Product\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder; 
use Illuminate\Support\Str;
use Modules\Core\Contracts\ProductContract;
use Modules\Product\Models\ProductVariant;

class Product extends Model implements ProductContract
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'brand_id',
        'name',
        'description',
        'sku',
        'price',
        'discount_price',
        'tax_rate',
        'stock',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'tax_rate' => 'decimal:2',
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
     * Get the variants for the product.
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\Modules\Product\Models\ProductVariant>
    */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
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

    /**
     * Get the promotions applicable to the product.
     * Note: This will need additional logic to check for active promotions by date.
     */
    public function promotions(): HasMany
    {
        // Direct promotions for this product
        return $this->hasMany(Promotion::class, 'entity_id')
                    ->where('type', 'product')
                    ->whereColumn('entity_id', 'products.id'); // Ensure it matches this product's ID
    }

    // You might also want a method to get *all* applicable promotions (including category/brand/global)
    // This would involve more complex querying or joining in your service layer or query scopes.

    /**
     * Apply filters to the product query.
     */
    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when(isset($filters['search']), function ($query) use ($filters) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('sku', 'like', '%' . $filters['search'] . '%');
        });

        $query->when(isset($filters['category']), function ($query) use ($filters) {
            $query->whereHas('categories', function ($q) use ($filters) {
                $q->where('slug', $filters['category']);
            });
        });

        $query->when(isset($filters['brand']), function ($query) use ($filters) {
            $query->whereHas('brand', function ($q) use ($filters) {
                $q->where('slug', $filters['brand']);
            });
        });

        $query->when(isset($filters['price_min']), function ($query) use ($filters) {
            $query->where('price', '>=', $filters['price_min']);
        });

        $query->when(isset($filters['price_max']), function ($query) use ($filters) {
            $query->where('price', '<=', $filters['price_max']);
        });

        // Filter by attribute values (e.g., color:red, size:large)
        // This assumes filters['attributes'] is an array like ['color:red', 'size:large']
        $query->when(isset($filters['attributes']) && is_array($filters['attributes']), function ($query) use ($filters) {
            foreach ($filters['attributes'] as $attributeFilter) {
                // Expect format like 'color:red'
                if (Str::contains($attributeFilter, ':')) {
                    list($attributeName, $attributeValue) = explode(':', $attributeFilter, 2);

                    $query->whereHas('variants.attributeValues', function ($q) use ($attributeName, $attributeValue) {
                        $q->where('value', $attributeValue)
                          ->whereHas('attribute', function ($qq) use ($attributeName) {
                              $qq->where('name', $attributeName);
                          });
                    });
                }
            }
        });

        // Filter by stock status (e.g., in_stock=true)
        $query->when(isset($filters['in_stock']), function ($query) use ($filters) {
            if ($filters['in_stock'] === 'true' || $filters['in_stock'] === true) {
                $query->where(function ($q) {
                    $q->where('stock', '>', 0) // For simple products
                      ->orWhereHas('variants', function ($vq) { // For products with variants
                          $vq->where('stock', '>', 0);
                      });
                });
            } else if ($filters['in_stock'] === 'false' || $filters['in_stock'] === false) {
                 $query->where(function ($q) {
                    $q->where('stock', '=', 0) // For simple products
                      ->whereDoesntHave('variants') // If no variants, must be 0 stock
                      ->orWhereDoesntHave('variants', function ($vq) { // Or if variants, none are in stock
                          $vq->where('stock', '>', 0);
                      });
                });
            }
        });

        $query->when($filters['has_promotion'] ?? null, function ($query, $hasPromotion) {
            if (!filter_var($hasPromotion, FILTER_VALIDATE_BOOLEAN)) {
                return;
            }

            // A product is on sale if...
            $query->where(function (Builder $q) {
                // 1. It has a direct, active product promotion.
                $q->whereHas('promotions', fn(Builder $promoQuery) => $promoQuery->active());

                // 2. OR it belongs to a category with an active promotion.
                $q->orWhereHas('categories.promotions', fn(Builder $promoQuery) => $promoQuery->active());

                // 3. OR it belongs to a brand with an active promotion.
                $q->orWhereHas('brand.promotions', fn(Builder $promoQuery) => $promoQuery->active());

                // 4. OR there is at least one active "global" promotion in the database.
                $q->orWhereExists(function ($subQuery) {
                    $subQuery->select(DB::raw(1))
                             ->from('promotions')
                             
                             // Manually apply the conditions from the active() scope
                             ->where('is_active', true)
                             ->where('start_date', '<=', now())
                             ->where(function ($dateQuery) {
                                 $dateQuery->whereNull('end_date')
                                           ->orWhere('end_date', '>=', now());
                             })
                             ->where('type', 'global');
                });
            });
        });

        // Add sorting options
        $query->when(isset($filters['sort_by']), function ($query) use ($filters) {
            $direction = $filters['sort_dir'] ?? 'asc';
            if (in_array($filters['sort_by'], ['name', 'price', 'created_at', 'updated_at'])) {
                $query->orderBy($filters['sort_by'], $direction);
            }
        });
    }
}