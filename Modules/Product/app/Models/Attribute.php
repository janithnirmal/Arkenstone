<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attribute extends Model
{
    use HasFactory;

    public $timestamps = false; // Attributes themselves might not need timestamps

    protected $fillable = [
        'name',
    ];

    /**
     * Get the values for the attribute.
     */
    public function values(): HasMany
    {
        return $this->hasMany(AttributeValue::class);
    }
}