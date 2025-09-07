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
use Modules\Core\Contracts\ProductVariantContract;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Modules\Product\Events\ProductImagesUploaded;
use Modules\Product\Models\ProductImage;
use Modules\Core\Contracts\ProductImageContract;
use Modules\Product\Events\ProductImageDeleted;
use Modules\Product\Events\StockUpdated;

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
    
    public function createProductVariant(ProductContract|Product $product, array $data): ProductVariantContract
    {
        $variantData = collect($data)->except('attribute_value_ids')->toArray();
        $variant = $product->variants()->create($variantData);

        if (!empty($data['attribute_value_ids'])) {
            $variant->attributeValues()->attach($data['attribute_value_ids']);
        }
        // Fire event: ProductVariantCreated
        return $variant;
    }

    public function updateProductVariant(ProductVariantContract|ProductVariant $variant, array $data): ProductVariantContract
    {
        $variantData = collect($data)->except('attribute_value_ids')->toArray();
        $variant->update($variantData);

        if (isset($data['attribute_value_ids'])) {
            $variant->attributeValues()->sync($data['attribute_value_ids']);
        }
        // Fire event: ProductVariantUpdated
        return $variant->fresh('attributeValues.attribute');
    }

    public function deleteProductVariant(ProductVariantContract|ProductVariant $variant): bool
    {
        // Fire event: ProductVariantDeleted
        return $variant->delete();
    }

    public function addImagesToProduct(ProductContract|Product $product, array $images): Collection
    {
        $createdImages = new Collection();

        DB::transaction(function () use ($product, $images, &$createdImages) {
            foreach ($images as $imageFile) {
                if ($imageFile instanceof UploadedFile) {
                    // Store the file and get its relative path. This is what we save.
                    $path = $imageFile->store('products', 'public');

                    // Create the database record for the image.
                    $newImage = $product->images()->create([
                        'url' => $path, // <-- STORE THE RELATIVE PATH, NOT THE FULL URL
                        'alt_text' => $product->name,
                        'is_primary' => false,
                    ]);

                    $createdImages->push($newImage);
                }
            }
        });

        if ($createdImages->isNotEmpty()) {
            ProductImagesUploaded::dispatch($product, $createdImages);
        }

        return $createdImages;
    }

    public function deleteImage(ProductImageContract|ProductImage $image): bool
    {
        // The relative path is now stored directly in the 'url' property.
        $path = $image->getUrl(); // This returns the relative path

        // Delete the physical file from storage.
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        // Then delete the database record.
        $result = $image->delete();

        // If the deletion was successful, dispatch the event.
        if ($result) {
            ProductImageDeleted::dispatch($image);
        }

        return $result;
    }

    public function updateProductStock(ProductContract|Product $product, int $quantity): ProductContract
    {
        $oldStock = $product->stock;
        $product->update(['stock' => $quantity]);

        StockUpdated::dispatch($product, $oldStock, $quantity);

        return $product->fresh();
    }

    public function updateVariantStock(ProductVariantContract|ProductVariant $variant, int $quantity): ProductVariantContract
    {
        $oldStock = $variant->stock;
        $variant->update(['stock' => $quantity]);

        StockUpdated::dispatch($variant, $oldStock, $quantity);

        return $variant->fresh();
    }
}