<?php

namespace App\Http\Controllers\Shop;

use App\Helpers\ResponseProtocol;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends \App\Http\Controllers\Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        // config
        $LATEST_PRODUCT_DAYS = 7;
        $DEFAULT_LIMIT = 1000000;
        $DEFAULT_OFFSET = 0;

        $request->validate([
            'id' => 'integer|exists:products,id',
            'search' => 'string|nullable',
            'name' => 'string|exists:products,name',
            'slug' => 'string|exists:products,slug',

            'category_id' => 'integer|exists:categories,id',
            'category_ids' => 'array',
            'category_ids.*' => 'integer|exists:categories,id',

            'variation_option_ids' => 'array',
            'variation_option_ids.*' => 'integer|exists:variation_options,id',

            'taxonomy' => 'string',
            'taxonomy_ids' => 'array',
            'taxonomy_ids.*' => 'integer|exists:taxonomies,id',

            'web_price_min' => 'integer',
            'web_price_max' => 'integer',
            'pos_price_min' => 'integer',
            'pos_price_max' => 'integer',

            'in_stock' => 'boolean',
            'out_of_stock' => 'boolean',

            'has_web_discount' => 'boolean',
            'has_pos_discount' => 'boolean',

            'newly_arrived' => 'boolean',
            'suggested' => 'boolean',

            'limit' => 'integer|min:0',
            'offset' => 'integer|min:0',
            'sortBy' => 'string|in:web_price_high_low,web_price_low_high,pos_price_high_low,pos_price_low_high,web_discount_high_low,web_discount_low_high,pos_discount_high_low,pos_discount_low_high,name_a_z,name_z_a,added_date_new_old,added_date_old_new',

            "with" => "string|in:category,taxonomies,stocks,all,none,product,images",
        ]);

        $withQuery = [];
        $withMap = [
            "category" => ["category"],
            "taxonomies" => ["taxonomies"],
            "product" => ["category", "taxonomies"],
            "images" => ["images"],
            "stocks" => ["stocks.variationStocks", "stocks.variationStocks.variationOption", "stocks.variationStocks.variationOption.variation"],
            "all" => ["category", "taxonomies", "stocks.variationStocks", "stocks.variationStocks.variationOption", "stocks.variationStocks.variationOption.variation", "images"],
            "none" => [],
        ];

        if ($request->has('with')) {
            $withQuery = $withMap[$request->with];
        } else {
            $withQuery = $withMap["all"];
        }


        $products = Product::query()
            ->with($withQuery)
            ->whereHas('stocks', function ($query) {
                $query->whereRaw('quantity - reserved_quantity > 1');
            });

        // Fetch a product by id
        if ($request->has('id')) {
            $product = $products->where('id', $request->id)->first();
            return ResponseProtocol::success($product, 'Successfully fetched product by id');
        }
        if ($request->has('all-products')) {
            $products = Product::with('category')->get();
            return ResponseProtocol::success($products, 'Successfully fetched all products');
        }

        // Fetch products by name
        if ($request->has('name')) {
            $products->where('name', 'like', '%' . $request->name . '%');
            return ResponseProtocol::success($products->get(), 'Successfully fetched products by name');
        }

        // Fetch products by slug
        if ($request->has('slug')) {
            $products->where('slug', 'like', '%' . $request->slug . '%');
            return ResponseProtocol::success($products->get(), 'Successfully fetched products by slug');
        }

        // Fetch products by category id
        if ($request->has('category_id')) {
            $products->where('category_id', $request->category_id);
        }

        // Fetch products by category ids
        if ($request->has('category_ids') && count($request->category_ids) > 0) {
            $products->where(function ($query) use ($request) {
                $query->whereIn('category_id', $request->category_ids);
            });
        }

        // Fetch products by taxonomy
        if ($request->has('taxonomy')) {
            $taxonomyQuery = $request->taxonomy;
            $taxonomyWords = explode(' ', $taxonomyQuery);
            $products->where(function ($q) use ($taxonomyWords) {
                foreach ($taxonomyWords as $word) {
                    $q->orWhereHas('taxonomies', function ($query) use ($word) {
                        $query->where('name', 'like', "%$word%");
                    });
                }
            });
        }

        // Fetch products by taxonomy ids
        if ($request->has('taxonomy_ids') && count($request->taxonomy_ids) > 0) {
            $taxonomyIds = $request->taxonomy_ids;
            $products->where(function ($query) use ($taxonomyIds) {
                foreach ($taxonomyIds as $taxonomyId) {
                    $query->whereHas('taxonomies', function ($query) use ($taxonomyId) {
                        $query->where('taxonomy_id', $taxonomyId);
                    });
                }
            });
        }

        // Fetch products by query
        if ($request->has('search')) {
            $query = $request->search;
            $words = explode(' ', $query); // Split query into words

            $products->where(function ($q) use ($words) {
                foreach ($words as $word) {
                    $q->orWhere('name', 'like', "%$word%")
                        ->orWhere('description', 'like', "%$word%")
                        ->orWhereHas('category', function ($query) use ($word) {
                            $query->where('name', 'like', "%$word%");
                        })
                        ->orWhereHas('taxonomies', function ($query) use ($word) {
                            $query->where('name', 'like', "%$word%");
                        });
                }
            });
        }

        if ($request->has('variation_option_ids') && count($request->variation_option_ids) > 0) {
            $products->whereHas('stocks', function ($query) use ($request) {
                $query->whereHas('variationStocks', function ($query) use ($request) {
                    $query->whereIn('variation_option_id', $request->variation_option_ids);
                }, '>=', 1); // Ensure at least one variation option is matched
            }, '>=', 1)
                // ->whereHas('stocks', function ($query) {
                //     $query->whereRaw('quantity - reserved_quantity > 0');
                // })
            ;
        }

        // Filter by Price 💸
        // Fetch products by web price
        if ($request->has('web_price_min') && $request->has('web_price_max')) {
            $products->whereHas('stocks', function ($query) use ($request) {
                $query->where('web_price', '>=', $request->web_price_min)->where('web_price', '<=', $request->web_price_max);
            });
        }

        // Fetch products by pos price
        if ($request->has('pos_price_min') && $request->has('pos_price_max')) {
            $products->whereHas('stocks', function ($query) use ($request) {
                $query->where('pos_price', '>=', $request->pos_price_min)->where('pos_price', '<=', $request->pos_price_max);
            });
        }


        // instock filter
        if ($request->has('in_stock') && $request->in_stock) {
            $products->whereHas('stocks', function ($query) use ($request) {
                $query->whereRaw('quantity - reserved_quantity > 0');
            });
        }

        // out of stock filter
        if ($request->has('out_of_stock') && $request->out_of_stock) {
            $products->whereDoesntHave('stocks', function ($query) {
                $query->whereRaw('quantity - reserved_quantity > 0');
            }); // Ensure no stock records have quantity greater than 0 after subtracting reserved quantity
        }

        // Discount filter
        // has web discount filter
        if ($request->has('has_web_discount') && $request->has_web_discount) {
            $products->whereHas('stocks', function ($query) use ($request) {
                $query->where('web_discount', '>', 0);
            });
        }

        // has pos discount filter
        if ($request->has('has_pos_discount') && $request->has_pos_discount) {
            $products->whereHas('stocks', function ($query) use ($request) {
                $query->where('pos_discount', '>', 0);
            });
        }

        // Newly Arrived
        if ($request->has('newly_arrived') && $request->newly_arrived) {
            // check if new arrivals available
            $newArrivals = Product::where('created_at', '>=', now()->subDays($LATEST_PRODUCT_DAYS))->count();
            if ($newArrivals !== 0) {
                $products->where('created_at', '>=', now()->subDays($LATEST_PRODUCT_DAYS));
            }

        }

        // Newly Arrived
        if ($request->has('suggested') && $request->suggested) {
            $suggestedIds = Product::get()->random(6)->pluck("id");
            $products->whereIn("id", $suggestedIds);
        }


        // sorting
        if ($request->has('sortBy')) {
            // by price
            $sortBy = $request->sortBy ?? "name_z_a";

            if ($sortBy == "web_price_high_low") {
                $products->whereHas('stocks', function ($query) use ($request) {
                    $query->orderBy('web_price', "desc");
                });
            }

            if ($sortBy == "web_price_low_high") {
                $products->whereHas('stocks', function ($query) use ($request) {
                    $query->orderBy('web_price', "asc");
                });
            }

            if ($sortBy == "pos_price_high_low") {
                $products->whereHas('stocks', function ($query) use ($request) {
                    $query->orderBy('pos_price', "desc");
                });
            }

            if ($sortBy == "pos_price_low_high") {
                $products->whereHas('stocks', function ($query) use ($request) {
                    $query->orderBy('pos_price', "asc");
                });
            }

            if ($sortBy == "web_discount_high_low") {
                $products->whereHas('stocks', function ($query) use ($request) {
                    $query->orderBy('web_discount', "desc");
                });
            }

            if ($sortBy == "web_discount_low_high") {
                $products->whereHas('stocks', function ($query) use ($request) {
                    $query->orderBy('web_discount', "asc");
                });
            }
            $products->whereHas('stocks', function ($query) use ($request) {
                $query->orderBy('web_price', ($request->sort_by_web_price ?? "high_low") ? "asc" : "desc");
            });

            if ($sortBy == "pos_discount_high_low") {
                $products->whereHas('stocks', function ($query) use ($request) {
                    $query->orderBy('pos_discount', "desc");
                });
            }

            if ($sortBy == "pos_discount_low_high") {
                $products->whereHas('stocks', function ($query) use ($request) {
                    $query->orderBy('pos_discount', "asc");
                });
            }

            if ($sortBy == "name_a_z") {
                $products->orderBy('name', "asc");
            }

            if ($sortBy == "name_z_a") {
                $products->orderBy('name', "desc");
            }

            if ($sortBy == "added_date_new_old") {
                $products->orderBy('created_at', "desc");
            }

            if ($sortBy == "added_date_old_new") {
                $products->orderBy('created_at', "asc");
            }
        }

        // Fetch all products
        $response = $products->limit($request->limit ?? $DEFAULT_LIMIT)->offset($request->offset ?? $DEFAULT_OFFSET)->get();
        return ResponseProtocol::success($response, "Successfully fetched " . $response->count() . " products");
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
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'slug' => 'string|max:255|unique:products,slug',
            'description' => 'required|string|max:512',
            'category_id' => 'required|integer|exists:categories,id',
            'primary_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',

            'web_availability' => 'string|max:255',
        ]);

        // validate image 
        if (!$request->hasFile('primary_image')) {
            return ResponseProtocol::error("Image is required");
        }

        $slug = $validated['slug'] ?? Str::slug($validated['name']);

        try {
            // save image to storage
            $imageFile = $request->file('primary_image');
            $fileName = $slug . '.' . $imageFile->extension();
            $imageFile = Storage::disk('products')->putFileAs('/', $imageFile, $fileName);

            // save product in DB
            $product = new Product();
            $product->name = $validated['name'];
            $product->slug = $slug;
            $product->description = $validated['description'];
            $product->category_id = (int) $validated['category_id'];
            $product->primary_image = "storage/images/products/$imageFile";

            $product->web_availability = $validated['web_availability'] ?? null;
            $product->save();

            return ResponseProtocol::success($product, 'Product created successfully');
        } catch (\Exception $e) {
            return ResponseProtocol::error($e->getMessage());
        }


    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:products,id',
            'name' => 'string|max:255|unique:products,name',
            'slug' => 'string|max:255|unique:products,slug',
            'description' => 'string|max:512',
            'category_id' => 'integer|exists:categories,id',
            'primary_image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product = Product::find($validated['id']);

        if ($request->has('name')) {
            $product->name = $request->name;
        }

        if ($request->has('slug')) {
            $product->slug = $request->slug;
        }

        if ($request->has('description')) {
            $product->description = $request->description;
        }

        if ($request->has('category_id')) {
            $product->category_id = (int) $request->category_id;
        }

        if ($request->hasFile('primary_image')) {

            // delete old image
            $oldImage = $product->primary_image; // ex: storage/images/products/slug.jpg
            $fileName = basename($oldImage);
            if (Storage::disk('products')->delete($fileName)) {
                Log::info("Old image deleted successfully");
            }

            // save new image
            $imageFile = $request->file('primary_image');
            $fileName = $product->slug . '.' . $imageFile->extension();
            $imageFile = Storage::disk('products')->putFileAs('/', $imageFile, $fileName);
            $product->primary_image = "storage/images/products/$imageFile";
        }

        $product->save();

        return ResponseProtocol::success($product, 'Product updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:products,id',
        ]);

        $product = Product::find($validated['id']);
        $product->delete();
        return ResponseProtocol::success($product, 'Product deleted successfully');
    }





    public function multipleStockHandler()
    {
        // Load all products with their stocks and variation stocks
        $products = Product::with('stocks.variationStocks')->get();

        // Filter products that have stocks with the same variation_option_id
        $filteredProducts = $products->filter(function ($product) {
            $variationOptionIds = [];

            foreach ($product->stocks as $stock) {
                foreach ($stock->variationStocks as $variationStock) {
                    $variationOptionIds[] = $variationStock->variation_option_id;
                }
            }

            // Check if there are duplicate variation_option_ids
            return count($variationOptionIds) !== count(array_unique($variationOptionIds));
        });

        //return $filteredProducts;

        // Further filter products where the first stock's quantity is less than 13
        $finalFilteredProducts = $filteredProducts->filter(function ($product) {
            return $product->stocks->isNotEmpty() && $product->stocks->first()->quantity < 5;
        });



        // Process each product in the final filtered list
        $finalFilteredProducts->each(function ($product) {
            $stocks = $product->stocks;

            if ($stocks->count() > 1) {
                // Get the first stock and its quantity
                $firstStock = $stocks->first();
                $firstStockQuantity = $firstStock->quantity;

                // Get the second stock
                $secondStock = $stocks->get(1);

                // Add the first stock's quantity to the second stock's quantity
                $secondStock->quantity += $firstStockQuantity;
                $secondStock->save();

                // Delete the first stock
                $firstStock->delete();
            }
        });

        return response()->json(['message' => 'Stocks updated successfully'], 200);
    }
}
