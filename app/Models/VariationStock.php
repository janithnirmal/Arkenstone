<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariationStock extends Model
{
    /** @use HasFactory<\Database\Factories\VariationStockFactory> */
    use HasFactory;

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    public function variationOption()
    {
        return $this->belongsTo(VariationOption::class);
    }

    protected $fillable = [
        'stock_id',
        'variation_option_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
