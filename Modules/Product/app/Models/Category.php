<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Product\Database\Factories\CategoryFactory;




class Category extends Model
{
    /** @use HasFactory<\Modules\Product\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected static function newFactory()
    {
        return CategoryFactory::new();
    }

    protected $fillable = ['name', 'slug'];
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }
}
