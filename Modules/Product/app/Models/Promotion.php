<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Product\Models\Product;
use Modules\Product\Models\Category;
use Modules\Product\Models\Brand;
use Modules\Core\Contracts\PromotionContract;

class Promotion extends Model implements PromotionContract
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'type',
        'entity_id',
        'discount_percent',
        'discount_fixed',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'discount_percent' => 'decimal:2',
        'discount_fixed' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    // Method to check if promotion is currently active
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where('start_date', '<=', now())
                     ->where(function ($query) {
                         $query->whereNull('end_date')
                               ->orWhere('end_date', '>=', now());
                     });
    }

    // Dynamic relationship based on 'type'
    public function entity()
    {
        switch ($this->type) {
            case 'product':
                return $this->belongsTo(Product::class, 'entity_id');
            case 'category':
                return $this->belongsTo(Category::class, 'entity_id');
            case 'brand':
                return $this->belongsTo(Brand::class, 'entity_id');
            // 'taxonomy' or 'global' might not have a direct Eloquent relationship via entity_id
            // 'taxonomy' would likely involve a pivot table to multiple taxonomy items.
            // 'global' doesn't relate to a specific entity.
            default:
                return null; // Or throw an exception
        }
    }
}