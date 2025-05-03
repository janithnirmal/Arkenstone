<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Stock extends Model
{
    /** @use HasFactory<\Database\Factories\StockFactory> */
    use HasFactory;

    protected $fillable = [
        'product_id',
        'variation_option_id',
        'quantity',
        'web_price',
        'pos_price',
        'web_discount',
        'pos_discount',
        'reserved_quantity',
        'cost',
        'alert_quantity',
        'purchase_date',
        'supplier_id',
        'barcode',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }


    public function variationStocks()
    {
        return $this->hasMany(VariationStock::class);
    }

    /**
     * Can Reduce Quantity
     * @description This will check if the quantity can be reduced from the stock. incase if the served stock has reserved quantity, it will check if the remaining stock is enough to subtract after subtracting the reserved quantity
     * @param int $quantity
     * @return bool
     */
    public function canReduceQuantity(int $quantity)
    {
        return $this->quantity - $this->reserved_quantity >= $quantity;
    }

    /**
     * Release Reserved Quantity
     * @description This will remove the quantity from the reserved quantity
     * @param int $quantity
     * @throws \Exception
     * @return void
     */
    public function releaseReservedQuantity(int $quantity)
    {
        if ($this->reserved_quantity - $quantity < 0) {
            throw new \Exception('Insufficient reserved stock', 422);
        }

        $this->reserved_quantity -= $quantity;
        $this->save();
    }

    /**
     * Add Reserved Quantity
     * @description This will add the quantity to the reserved quantity
     * @param int $quantity
     * @throws \Exception
     * @return void
     */
    public function addReservedQuantity(int $quantity)
    {
        if ($this->quantity - $this->reserved_quantity < $quantity) {
            throw new \Exception('Insufficient stock', 422);
        }

        $this->reserved_quantity += $quantity;
        $this->save();
    }

    /**
     *  Clear Stock Quantity
     * @description This will remove the quantity from the stock and reserved quantity both at once. if there is no enough stock, it will throw an exception
     * @param mixed $removeQuantity
     * @throws \Exception
     * @return void
     */
    public function clearStockQuantity($removeQuantity)
    {
        if ($this->canReduceQuantity($removeQuantity)) {
            $this->quantity -= $removeQuantity;
            $this->reserved_quantity -= $removeQuantity;
            $this->save();
        } else {
            throw new \Exception('Insufficient stock', 422);
        }
    }
}
