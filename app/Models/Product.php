<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }


    public function taxonomies()
    {
        return $this->belongsToMany(Taxonomy::class, 'taxonomy_product');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}
