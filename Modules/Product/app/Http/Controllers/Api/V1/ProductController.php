<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Product\Models\Product;
use Modules\Product\Models\ProductVariant;
use Modules\Product\Models\ProductImage;
use Modules\Product\Http\Requests\StoreProductRequest;
use Modules\Product\Http\Requests\UpdateProductRequest;
use Modules\Product\Http\Resources\ProductCollection;
use Modules\Product\Http\Resources\ProductResource;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ProductCollection
    {
        $products = Product::with(['brand', 'categories', 'images', 'variants.attributeValues.attribute'])
            ->filter($request->all()) // Assuming you'll add local scopes for filtering
            ->paginate($request->get('limit', 10));

        return new ProductCollection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $product = Product::create($request->validated());

            // Attach categories
            if ($request->has('category_ids')) {
                $product->categories()->attach($request->input('category_ids'));
            }

            // Add images
            if ($request->has('images')) {
                foreach ($request->input('images') as $imageData) {
                    $product->images()->create($imageData);
                }
            }

            // Add variants and their attribute values
            if ($request->has('variants')) {
                foreach ($request->input('variants') as $variantData) {
                    $variant = $product->variants()->create([
                        'name' => $variantData['name'],
                        'sku' => $variantData['sku'],
                        'price' => $variantData['price'],
                        'discount_price' => $variantData['discount_price'] ?? null,
                        'stock' => $variantData['stock'],
                        'is_active' => $variantData['is_active'] ?? true,
                    ]);
                    if (!empty($variantData['attribute_value_ids'])) {
                        $variant->attributeValues()->attach($variantData['attribute_value_ids']);
                    }
                }
            }

            DB::commit();
            return (new ProductResource($product->load(['brand', 'categories', 'images', 'variants.attributeValues.attribute'])))
                ->response()
                ->setStatusCode(201); // 201 Created
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the exception
            Log::error("Failed to create product: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Failed to create product.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): ProductResource
    {
        // Eager load relationships for the single product view
        $product->loadMissing(['brand', 'categories', 'images', 'variants.attributeValues.attribute']);
        return new ProductResource($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        DB::beginTransaction();
        try {
            $product->update($request->validated());

            // Sync categories
            if ($request->has('category_ids')) {
                $product->categories()->sync($request->input('category_ids'));
            } else if ($request->has('category_ids')) { // If category_ids is empty array, detach all
                $product->categories()->detach();
            }

            // Handle images (add new, update existing, delete missing)
            $existingImageIds = collect($request->input('images'))->pluck('id')->filter()->toArray();
            $product->images()->whereNotIn('id', $existingImageIds)->delete(); // Delete removed images

            if ($request->has('images')) {
                foreach ($request->input('images') as $imageData) {
                    if (isset($imageData['id'])) {
                        // Update existing image
                        $product->images()->where('id', $imageData['id'])->update($imageData);
                    } else {
                        // Create new image
                        $product->images()->create($imageData);
                    }
                }
            }

            // Handle variants (add new, update existing, delete missing)
            $existingVariantIds = collect($request->input('variants'))->pluck('id')->filter()->toArray();
            $product->variants()->whereNotIn('id', $existingVariantIds)->delete(); // Delete removed variants

            if ($request->has('variants')) {
                foreach ($request->input('variants') as $variantData) {
                    $variantAttributeValueIds = $variantData['attribute_value_ids'] ?? [];
                    unset($variantData['attribute_value_ids']); // Remove to prevent mass assignment issues

                    if (isset($variantData['id'])) {
                        // Update existing variant
                        $variant = ProductVariant::find($variantData['id']);
                        if ($variant) {
                            $variant->update($variantData);
                            $variant->attributeValues()->sync($variantAttributeValueIds);
                        }
                    } else {
                        // Create new variant
                        $newVariant = $product->variants()->create($variantData);
                        if (!empty($variantAttributeValueIds)) {
                            $newVariant->attributeValues()->attach($variantAttributeValueIds);
                        }
                    }
                }
            }

            DB::commit();
            return (new ProductResource($product->load(['brand', 'categories', 'images', 'variants.attributeValues.attribute'])))
                ->response()
                ->setStatusCode(200); // 200 OK
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to update product: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Failed to update product.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        try {
            $product->delete(); // This uses soft deletes

            // If you want to force delete associated items (variants, images, pivot table entries)
            // when soft deleting the product, you need to set up cascading soft deletes or handle it manually.
            // For now, CASCADE on foreign keys in migrations means related data will be truly deleted
            // if product is truly deleted, but with soft deletes, they remain linked.

            return response()->json(['message' => 'Product deleted successfully.'], 204); // 204 No Content
        } catch (\Exception $e) {
            Log::error("Failed to delete product: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Failed to delete product.', 'error' => $e->getMessage()], 500);
        }
    }
}