<?php

namespace App\Http\Controllers;

use App\Helper\Response;
use App\Models\Stock;
use App\Models\VariationOption;
use Hamcrest\Core\IsTypeOf;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/** @var \Milon\Barcode\Facades\DNS1DFacade $DNS1D */

use Milon\Barcode\Facades\DNS1DFacade as DNS1D;
use Barryvdh\DomPDF\Facade\Pdf as PDF;


class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'id' => 'integer|exists:stocks,id',
            'with' => 'string',
            'detailed' => 'boolean',
        ]);

        $filterMap = [
            'product' => ['product'],
            'brand' => ['product.brand'],
            'categories' => ['product.category'],
            'taxonomies' => ['product.taxonomies'],
            'detailed_product' => ['product', 'product.brand', 'product.category', 'product.taxonomies'],
            'stocks' => ['variationStocks'],
            'variations' => ['variationStocks', 'variationStocks.variationOption', 'variationStocks.variationOption.variation'],
            'all' => ['product', 'product.brand', 'product.category', 'product.taxonomies', 'variationStocks', 'variationStocks.variationOption', 'variationStocks.variationOption.variation']
        ];


        $with = [];

        // add filters based on the requested pattern
        if ($request->has('with')) {
            $requestedFilters = explode(',', $request->with);
            foreach ($requestedFilters as $requestedFilter) {
                if (isset($filterMap[$requestedFilter])) {
                    foreach ($filterMap[$requestedFilter] as $filter) {
                        $with[] = $filter;
                    }
                } else {
                    return Response::error(['with' => 'Invalid filter: ' . $requestedFilter], 'Invalid filter', 422);
                }
            }
        } else if ($request->has('detailed')) {
            $with = $filterMap['all'];
        } else {
            $with = $filterMap['variations'];
        }

        Log::info($with);

        // 📦 Single Stock
        if ($request->has('id')) {
            $isDetailed = $request->detailed ?? false;
            $id = $request->id;
            $stock = Stock::with($with)->find($id);
            return Response::success($stock, 'Stock fetched successfully');
        }

        // 📦 General Stock
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ]);

        $stocks = Stock::query();

        if ($request->has('product_id')) {
            $stocks = $stocks->where('product_id', $request->product_id);
        }

        $stocks = $stocks->with($with)->get();
        return Response::success($stocks, 'Stocks fetched successfully');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'variations' => 'required|array',
            'quantity' => 'required|integer|max:1000000',
            'web_price' => 'required|numeric|max:1000000',
            'pos_price' => 'required|numeric|max:1000000',
            'supplier_id' => 'integer|exists:suppliers,id',
            'cost' => 'numeric|max:1000000',
            'web_discount' => 'required|numeric|min:0',
            'pos_discount' => 'required|numeric|min:0',
        ], [
            'web_price.max' => 'The web price may not be greater than 1000000.',
            'pos_price.max' => 'The pos price may not be greater than 1000000.',
            // 'web_discount.max' => 'The web discount may not be greater than 100.',
            // 'pos_discount.max' => 'The pos discount may not be greater than 100.',
            'quantity.max' => 'The quantity may not be greater than 1000000.',
        ]);


        DB::beginTransaction();

        try {
            // create stock
            $stock = Stock::create([
                'product_id' => (int) $request->product_id,
                'quantity' => (int) $request->quantity,
                'web_price' => (float) $request->web_price,
                'pos_price' => (float) $request->pos_price,
                'web_discount' => (float) $request->web_discount,
                'pos_discount' => (float) $request->pos_discount,
                'supplier_id' => (int) $request->supplier_id ?? 1,
                'cost' => (float) $request->cost ?? 0,
                'alert_quantity' => (int) $request->alert_quantity ?? 20,
                'purchase_date' => $request->purchase_date ?? now(),
                'barcode' => $request->barcode ?? null,
            ]);

            foreach ($request->variations as $variation) {
                // validate variation option
                $variationOption = VariationOption::find($variation);
                if (!$variationOption) {
                    return Response::error(['message' => 'Variation option not found'], 'Variation option not found', 404);
                }

                // create variation stock
                $stock->variationStocks()->create([
                    'stock_id' => (int) $stock->id,
                    'variation_option_id' => (int) $variation,
                ]);
            }

            // commit transaction
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);
            return Response::error(['message' => $e->getMessage()], 'Failed to create stock', 500);
        }


        return Response::success($stock, 'Stock created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stock $stock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:stocks,id',
            'quantity' => 'required|integer|max:1000000',
            'web_price' => 'required|numeric|max:1000000',
            'pos_price' => 'required|numeric|max:1000000',
            'web_discount' => 'required|numeric|max:100|min:0',
            'pos_discount' => 'required|numeric|max:100|min:0',

            'remove_variations' => 'array',
            'add_variations' => 'array',
            'replace_variations' => 'array',
        ]);

        $stock = Stock::find($request->id);
        if (!$stock) {
            return Response::error(['message' => 'Stock not found'], 'Stock not found', 404);
        }

        // Update Quantity
        if ($validated['quantity'] != $stock->quantity) {
            $stock->quantity = $validated['quantity'];
        }

        // Update Web Prices
        if ($validated['web_price'] != $stock->web_price) {
            $stock->web_price = $validated['web_price'];
        }

        // Update POS Prices
        if ($validated['pos_price'] != $stock->pos_price) {
            $stock->pos_price = $validated['pos_price'];
        }

        // Update Web Discount
        if ($validated['web_discount'] != $stock->web_discount) {
            $stock->web_discount = $validated['web_discount'];
        }

        // Update POS Discount
        if ($validated['pos_discount'] != $stock->pos_discount) {
            $stock->pos_discount = $validated['pos_discount'];
        }

        // validation variation IDs

        // Update Variation Combination
        // Add Variations
        if ($request->has('add_variations')) {
            if ($error = $this->hasInvalidVariationIds($request->add_variations)) {
                return $error;
            }

            if ($error = $this->variationIdExists($stock, $request->add_variations)) {
                return $error;
            }

            foreach ($request->add_variations as $variation) {
                $stock->variationStocks()->create([
                    'variation_option_id' => $variation,
                ]);
            }
        } else if ($request->has('remove_variations')) {
            if ($error = $this->variationIdExists($stock, $request->remove_variations, false)) {
                return $error;
            }

            $stock->variationStocks()->whereIn('variation_option_id', $request->remove_variations)->delete();
        } else if ($request->has('replace_variations')) {
            if ($error = $this->hasInvalidVariationIds($request->replace_variations)) {
                return $error;
            }

            $stock->variationStocks()->delete();
            foreach ($request->replace_variations as $variation) {
                $stock->variationStocks()->create([
                    'variation_option_id' => $variation,
                ]);
            }
        }

        // Update Stock
        $stock->save();
        return Response::success($stock, 'Stock updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:stocks,id',
        ]);

        $stock = Stock::find($request->id);
        $stock->variationStocks()->delete();
        $stock->delete();
        return Response::success($stock, 'Stock deleted successfully');
    }

    public function hasInvalidVariationIds($variations)
    {
        Log::info($variations);
        $stockVariationIds = VariationOption::all()->pluck('id')->toArray();
        foreach ($variations as $variation) {
            if (!in_array($variation, $stockVariationIds)) {
                Log::info("Variation ID : $variation is not valid");
                return Response::error(['message' => 'Invalid Variation Option'], 'Invalid Variation Option', 404);
            }
        }
        Log::info("Variation IDs are valid");

        return false;
    }

    public function variationIdExists($stock, $variations, $isNotExists = true)
    {
        Log::info($variations);
        $stockVariationIds = $stock->variationStocks()->pluck('variation_option_id')->toArray();
        foreach ($variations as $variation) {
            if ($isNotExists) {
                if (in_array($variation, $stockVariationIds)) {
                    Log::info("Variation ID : $variation is already exists");
                    return Response::error(['message' => 'Variation Option already exists'], 'Variation Option already exists', 404);
                }
            } else {
                if (!in_array($variation, $stockVariationIds)) {
                    Log::info("Variation ID : $variation is not exists");
                    return Response::error(['message' => 'Variation Option not exists'], 'Variation Option not exists', 404);
                }
            }
        }
        Log::info("Variation IDs are valid");

        return false;
    }

    public function editQuantity(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:stocks,id',
            'quantity' => 'required|integer|max:1000000',
            'action' => 'required|string|in:add,subtract,replace',
        ]);

        $stock = Stock::find($request->id);
        $quantity = $request->quantity;

        // Add Quantity
        if ($request->action == 'add') {
            $stock->quantity += $quantity;
        }

        // Subtract Quantity or Replace Stocks quantity
        if ($request->action == 'subtract') {
            if ($stock->canReduceQuantity($quantity)) {
                $stock->quantity -= $quantity;
            } else {
                return Response::error(['message' => 'Reserved quantity is greater than stock quantity'], 'Reserved quantity is greater than stock quantity', 422);
            }
        }

        // Replace Stocks quantity
        if ($request->action == 'replace') {
            if ($stock->reserved_quantity <= $quantity) {
                $stock->quantity = $quantity;
            } else {
                return Response::error(['message' => 'Reserved quantity is greater than stock quantity'], 'Reserved quantity is greater than stock quantity', 422);
            }
        }

        $stock->save();

        return Response::success($stock, 'Stock quantity updated successfully. New quantity is ' . $stock->quantity);
    }

    public function getStockByProductId(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ]);

        $stocks = Stock::where('product_id', $request->product_id)->get();
        return Response::success($stocks, 'Stocks fetched successfully');
    }

    public function printLabels(Request $request)
    {

        try {
            //code...
            $request->validate([
                'stock_id' => 'required|integer|exists:stocks,id',
                'type'=>'required|string|',
                'price_name_avilability' => 'required|string',
            ]);
            $type = $request->type;
            $price_name_avilability = $request->price_name_avilability;
            $stock = Stock::with('product')->find($request->stock_id);
            $barcode = $stock->barcode;
            $price = $stock->pos_price;
            $quantity = $stock->quantity;
            $disscount = $stock->pos_discount;
            //if discount avilabel and not equal to zero calcuate the disscount
            if ($disscount > 0) {
                $discountedPrice = $price - ($price * $disscount / 100);
                $barcode = $barcode . '|' . $discountedPrice;
            } else {
                $discountedPrice = $price;
            }
            $productName = $stock->product->name;
            $barcode = DNS1D::getBarcodePNG('4445645656', $type, 1, 33, array(0,0,0), true);
            if($price_name_avilability==='true'){
                $barcodeData = [
                    'barcode' => $barcode,
                    'product_name' => $productName,
                    'price' => $price,
                    'quantity' => $quantity,
                    'discounted_price' => $discountedPrice,
                ];

            }
            else{
                $barcodeData = [
                    'barcode' => $barcode,
                    'product_name' => '',
                    'price' => '',
                    'quantity' => $quantity,
                    'discounted_price' => $discountedPrice,
                ];
            }
           
            // Pass data to view
            return PDF::loadView('barcode-label', compact('barcodeData', 'barcode'))
                ->setPaper('A4')
                ->stream('barcodes.pdf');
            return Response::success($printedSheet, 'Barcode fetched successfully');
        } catch (\Throwable $th) {
            //throw $th;
            return Response::error($th->getMessage(), 'Failed to fetch barcode', 500);
        }
    }
    public function BarcodeType(){
        $barcodeTypes = [
            ['id' => 'C39', 'name' => 'Code 39'],
            ['id' => 'C39+', 'name' => 'Code 39 +'],
            ['id' => 'C39E', 'name' => 'Code 39 Extended'],
            ['id' => 'C39E+', 'name' => 'Code 39 Extended +'],
            ['id' => 'C93', 'name' => 'Code 93'],
            ['id' => 'S25', 'name' => 'Standard 2 of 5'],
            ['id' => 'S25+', 'name' => 'Standard 2 of 5 +'],
            ['id' => 'I25', 'name' => 'Interleaved 2 of 5'],
            ['id' => 'I25+', 'name' => 'Interleaved 2 of 5 +'],
            ['id' => 'C128', 'name' => 'Code 128'],
            ['id' => 'C128A', 'name' => 'Code 128 A'],
            ['id' => 'C128B', 'name' => 'Code 128 B'],
            ['id' => 'C128C', 'name' => 'Code 128 C'],
            ['id' => 'EAN2', 'name' => 'EAN 2 Digits'],
            ['id' => 'EAN5', 'name' => 'EAN 5 Digits'],
            ['id' => 'EAN8', 'name' => 'EAN 8'],
            ['id' => 'EAN13', 'name' => 'EAN 13'],
            ['id' => 'UPCA', 'name' => 'UPC-A'],
            ['id' => 'UPCE', 'name' => 'UPC-E'],
            ['id' => 'MSI', 'name' => 'MSI'],
            ['id' => 'MSI+', 'name' => 'MSI +'],
            ['id' => 'POSTNET', 'name' => 'PostNet'],
            ['id' => 'PLANET', 'name' => 'Planet'],
            ['id' => 'RMS4CC', 'name' => 'RMS4CC (Royal Mail)'],
            ['id' => 'KIX', 'name' => 'KIX (Netherlands)'],
            ['id' => 'IMB', 'name' => 'IMB (Intelligent Mail Barcode)'],
            ['id' => 'CODABAR', 'name' => 'Codabar'],
            ['id' => 'CODE11', 'name' => 'Code 11'],
            ['id' => 'PHARMA', 'name' => 'Pharmacode'],
            ['id' => 'PHARMA2T', 'name' => 'Two-track Pharmacode'],
        ];

        
        return Response::success($barcodeTypes, 'Barcode types fetched successfully');        
    }

    public function allStock(Request $request)
    {
        try {
            if ($request->has('id')) {
                $stock = Stock::with('product','supplier','variationStocks.variationOption')->find($request->id);
                if (!$stock) {
                    return Response::error(['message' => 'Stock not found'], 'Stock not found', 404);
                }
                return Response::success($stock, 'Stock fetched successfully');
            } else {
                $stocks = Stock::with('product','supplier','variationStocks.variationOption')->get();
                return Response::success($stocks, 'Stocks fetched successfully');
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return Response::error(['message' => 'An error occurred while fetching stocks'], 'Error', 500);
        }
    }

    public function recerveQuanityClear()
    {
        try {
            // Update all reserved_quantity to 0 in the stock table
            Stock::query()->update(['reserved_quantity' => 0]);
            return Response::success(null, 'All reserved quantities have been cleared successfully');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return Response::error(['message' => 'Failed to clear reserved quantities'], 'Error', 500);
        }
    }

        public function posStockUpdate(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|integer|exists:stocks,id',
                'quantity' => 'required|integer|max:1000000',
                'web_price' => 'required|numeric|max:1000000',
                'pos_price' => 'required|numeric|max:1000000',
                'web_discount' => 'required|numeric',
                'pos_discount' => 'required|numeric',
                'supplier_id' => 'integer|exists:suppliers,id',
                'cost' => 'numeric|max:1000000',
                'alert_quantity' => 'integer|max:1000000',
                'purchase_date' => 'date',
                'barcode' => 'string|max:255',
                'variation_option_id' => 'required|integer|exists:variation_options,id', // Validate variation option ID
            ]);
    
            $stock = Stock::find($request->id);
            if (!$stock) {
                return Response::error(['message' => 'Stock not found'], 'Stock not found', 404);
            }
    
            // Update stock details
            $stock->quantity = $request->quantity;
            $stock->web_price = $request->web_price;
            $stock->pos_price = $request->pos_price;
            $stock->web_discount = $request->web_discount;
            $stock->pos_discount = $request->pos_discount;
            $stock->supplier_id = $request->supplier_id;
            $stock->cost = $request->cost;
            $stock->alert_quantity = $request->alert_quantity;
            $stock->purchase_date = $request->purchase_date;
            $stock->barcode = $request->barcode;
            $stock->save();
    
            // Update variation option
            $variationOptionId = $request->variation_option_id;
    
            // Remove existing variation options and add the new one
            $stock->variationStocks()->delete();
            $stock->variationStocks()->create([
                'variation_option_id' => $variationOptionId,
            ]);
    
            return Response::success($stock, 'Stock and variation option updated successfully');
        } catch (\Throwable $th) {
            return Response::error($th->getMessage(), 'Failed to update stock', 500);
        }
    }

    public function test(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:stocks,id',
            'quantity' => 'required|integer|max:1000000',
        ]);

        $stock = Stock::find($request->id);
        $quantity = $request->quantity;


        // TEST 1 - ==================================

        // // reserve stock
        // try {
        //     $stock->addReservedQuantity($quantity);
        //     return true;
        // } catch (\Exception $e) {
        //     throw new \Exception('Insufficient stock', 422);
        // }


        // TEST 2 - ==================================

        // // release stock
        // try {
        //     $stock->releaseReservedQuantity($quantity);
        //     return true;
        // } catch (\Exception $e) {
        //     throw new \Exception('Insufficient reserved stock', 422);
        // }


        // TEST 3 - ==================================

        // edit stock quantity
        // try {
        //     $reduceQuantity = $quantity;
        //     if ($stock->canReduceQuantity($reduceQuantity) && $stock->reserved_quantity >= $reduceQuantity) {
        //         $stock->clearStockQuantity($reduceQuantity);
        //         $stock->save();
        //         return Response::success($stock, 'Stock quantity reduced successfully');
        //     } else {
        //         return Response::error(['message' => 'Insufficient stock'], 'Insufficient stock', 422);
        //     }
        // } catch (\Exception $e) {
        //     return Response::error(['message' => $e->getMessage()], $e->getMessage(), $e->getCode());
        // }
    }
}
