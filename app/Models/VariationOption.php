<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariationOption extends Model
{
    /** @use HasFactory<\Database\Factories\VariationOptionFactory> */
    use HasFactory;

    protected $fillable = [
        'variation_id',
        'name',
    ];
    
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function variation()
    {
        return $this->belongsTo(Variation::class);
    }

    public function variationStocks()
    {
        return $this->hasMany(VariationStock::class);
    }
}
