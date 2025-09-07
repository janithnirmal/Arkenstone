<?php

namespace Modules\Product\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\ProductContract;
use Modules\Core\Contracts\ProductManagerServiceInterface;
use Modules\Product\Events\ProductCreated;
use Modules\Product\Events\ProductDeleted;
use Modules\Product\Events\ProductUpdated;
use Modules\Product\Events\ProductViewed;
use Modules\Product\Models\Product;
use Modules\Product\Models\ProductVariant;

class ProductManagerService implements ProductManagerServiceInterface
{
    public function findProduct(int $id): ?ProductContract
    {
        $product = Product::with(['brand', 'categories', 'images', 'variants.attributeValues.attribute'])->find($id);

        if ($product) {
            ProductViewed::dispatch($product);
        }

        return $product;
    }

    public function queryProducts(array $filters): LengthAwarePaginator
    {
        $query = Product::with(['brand', 'categories', 'images', 'primaryImage', 'variants.attributeValues.attribute']);

        // Use the scopeFilter we created earlier
        $query->filter($filters);

        return $query->paginate($filters['limit'] ?? 15);
    }

    public function createProduct(array $data): ProductContract
    {
        return DB::transaction(function () use ($data) {
            $product = Product::create($data);

            if (!empty($data['category_ids'])) {
                $product->categories()->attach($data['category_ids']);
            }

            if (!empty($data['images'])) {
                $product->images()->createMany($data['images']);
            }

            if (!empty($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variant = $product->variants()->create($variantData);
                    if (!empty($variantData['attribute_value_ids'])) {
                        $variant->attributeValues()->attach($variantData['attribute_value_ids']);
                    }
                }
            }

            ProductCreated::dispatch($product);

            return $product;
        });
    }

    /**
     * @param Product $product The CONCRETE Eloquent model
     * @param array $data
     * @return ProductContract
     */
    public function updateProduct(ProductContract|Product $product, array $data): ProductContract
    {
        return DB::transaction(function () use ($product, $data) {
            $product->update($data);

            if (isset($data['category_ids'])) {
                $product->categories()->sync($data['category_ids']);
            }

            if (isset($data['images'])) {
                $existingImageIds = collect($data['images'])->pluck('id')->filter()->toArray();
                $product->images()->whereNotIn('id', $existingImageIds)->delete();
                foreach ($data['images'] as $imageData) {
                    $product->images()->updateOrCreate(['id' => $imageData['id'] ?? null], $imageData);
                }
            }

            if (isset($data['variants'])) {
                $existingVariantIds = collect($data['variants'])->pluck('id')->filter()->toArray();
                $product->variants()->whereNotIn('id', $existingVariantIds)->delete(); 
                foreach ($data['variants'] as $variantData) {
                    $variant = $product->variants()->updateOrCreate(['id' => $variantData['id'] ?? null], $variantData); 
                    if (isset($variantData['attribute_value_ids'])) {
                        $variant->attributeValues()->sync($variantData['attribute_value_ids']);
                    }
                }
            }

            ProductUpdated::dispatch($product->fresh());
            return $product->fresh();
        });
    }

    /**
     * @param Product $product The CONCRETE Eloquent model
     * @return bool
     */
    public function deleteProduct(ProductContract|Product $product): bool
    {
        $result = $product->delete();

        if ($result) {
            ProductDeleted::dispatch($product);
        }
        return $result;
    }
}