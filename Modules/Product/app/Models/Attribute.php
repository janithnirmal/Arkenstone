<?php

namespace Modules\Product\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Core\Contracts\AttributeContract;

class Attribute extends Model implements AttributeContract
{
    use HasFactory;

    public $timestamps = false; // Attributes themselves might not need timestamps

    protected $fillable = [
        'name',
    ];

    /**
     * Get the values for the attribute.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<AttributeValue>
     */
    public function values(): HasMany
    {
        return $this->hasMany(AttributeValue::class);
    }

}