<?php

namespace Modules\Core\Contracts\Products;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

interface ProductContract
{

    /**
     * Get the brand that owns the product.
     */
    public function brand(): BelongsTo;


    /**
     * Get the categories that belong to the product.
     */
    public function categories(): BelongsToMany;


    /**
     * Get the images for the product.
     */
    public function images(): HasMany;

    /**
     * Scope a query to only include active products.
     * This is a great default filter to apply.
     */
    public function scopeIsActive(Builder $query): Builder;

    /**
     * Scope a query to filter by name using a LIKE search.
     */
    public function scopeFilterByName(Builder $query, string $name): Builder;


    /**
     * Scope a query to filter by a minimum price.
     */
    public function scopeMinPrice(Builder $query, float $price): Builder;

    /**
     * Scope a query to filter by a maximum price.
     */
    public function scopeMaxPrice(Builder $query, float $price): Builder;

    /**
     * Scope a query to filter products belonging to a specific category slug.
     * (Assumes you have a 'categories' relationship defined on this model).
     */
    public function scopeByCategory(Builder $query, string $slug): Builder;
}