<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Taxonomy extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'taxonomy_type_id',
        'parent_id',
        'name',
        'slug',
        'description',
        'sort_order',
        'meta'
    ];
    protected $casts = ['meta' => 'array'];

    public function type(): BelongsTo
    {
        return $this->belongsTo(TaxonomyType::class, 'taxonomy_type_id');
    }
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Taxonomy::class, 'parent_id');
    }
    public function children(): HasMany
    {
        return $this->hasMany(Taxonomy::class, 'parent_id');
    }
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(\Modules\Product\Models\Product::class, 'product_taxonomy')->withTimestamps();
    }

    
}
