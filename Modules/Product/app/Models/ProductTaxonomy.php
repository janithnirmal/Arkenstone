<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Product\Database\Factories\ProductTaxonomyFactory;

class ProductTaxonomy extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'product_id',
        'taxonomy_id',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function taxonomy()
    {
        return $this->belongsTo(Taxonomy::class);
    }

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
