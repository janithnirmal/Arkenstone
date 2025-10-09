<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Product\Database\Factories\TaxonomyTypeFactory;

class TaxonomyType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['name', 'slug', 'description'];

    // protected static function newFactory(): TaxonomyTypeFactory
    // {
    //     // return TaxonomyTypeFactory::new();
    // }
    protected function taxonomies()
    {
        return $this->hasMany(Taxonomy::class);
    }
}
