<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Modules\Core\Contracts\ProductContract;
use Modules\Product\Database\Factories\ProductFactory;

class Product extends Model implements ProductContract
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'stock_quantity',
    ];

    /**
     * The relationships that should always be loaded.
     * Use with caution, but helpful for an API-driven module.
     */
    protected $with = ['images'];

    protected static function newFactory()
    {
        return ProductFactory::new();
    }

    // --- Eloquent Relationships ---

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function terms(): BelongsToMany
    {
        return $this->belongsToMany(Term::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    // --- Helper Methods ---

    /**
     * Gets the primary image for the product.
     */
    public function getThumbnail(): ?ProductImage
    {
        return $this->images()->where('is_primary', true)->first();
    }

    /**
     * A convenient accessor for the primary image URL.
     */
    public function getThumbnailUrlAttribute(): string
    {
        $thumbnail = $this->getThumbnail();
        if ($thumbnail) {
            // Assuming you have a 'products' disk configured in filesystems.php
            try {
                return Storage::disk('products')->url($thumbnail->path);
            } catch (\Throwable $th) {
                Log::info("image saving proceed but crashed due to storage realted issue");
            }
        }
        // Fallback placeholder
        return 'https://via.placeholder.com/400x400.png?text=No+Image';
    }


    // --- Implementation of ProductContract Methods ---

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPrice(): float
    {
        return (float) $this->price;
    }

    /**
     * Returns the primary image URL.
     */
    public function getImageUrl(): ?string
    {
        return $this->getThumbnailUrlAttribute();
    }

    public function isInStock(): bool
    {
        return $this->stock_quantity > 0;
    }

    // Add new methods required by the updated contract
    public function getCategories()
    {
        return $this->categories;
    }

    public function getTerms()
    {
        return $this->terms;
    }
}