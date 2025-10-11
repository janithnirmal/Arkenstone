<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Core\Contracts\BrandContract;

class Brand extends Model implements BrandContract
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'logo',
    ];

    /**
     * Get the products for the brand.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the promotions applicable to the brand.
     */
    public function promotions(): HasMany
    {
        return $this->hasMany(Promotion::class, 'entity_id')
            ->where('type', 'brand')
            ->whereColumn('entity_id', 'brands.id');
    }
}