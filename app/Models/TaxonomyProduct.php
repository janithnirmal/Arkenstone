<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxonomyProduct extends Model
{

    protected $table = 'taxonomy_product';

    /** @use HasFactory<\Database\Factories\TaxonomyProductFactory> */
    use HasFactory;

    protected $fillable = [
        'taxonomy_id',
        'product_id',
    ];
    
}
