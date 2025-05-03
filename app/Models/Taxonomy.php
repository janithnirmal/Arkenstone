<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Taxonomy extends Model
{
    
    /** @use HasFactory<\Database\Factories\TaxonomyFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'taxonomy_product');
    }
}
