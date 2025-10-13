<?php

namespace Modules\Product\Services;


use Faker\Provider\Image;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Str;
use Modules\Core\Contracts\ProductManagerServiceInterface;
use Modules\Product\Events\ProductCreated;
use Modules\Product\Events\ProductDeleted;
use Modules\Product\Events\ProductUpdated;
use Modules\Product\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Modules\Product\Events\ProductImagesUploaded;
use Modules\Product\Models\ProductImage;
use Modules\Core\Contracts\ProductImageContract;
use Modules\Core\Contracts\Products\ProductContract;
use Modules\Product\Events\ProductImageDeleted;
use Modules\Product\Helpers\ProductFilter;

class ProductManagerService implements ProductManagerServiceInterface
{

    /**
     * A whitelist of relations that are safe to be eager-loaded.
     * @var array
     */
    protected array $allowedRelations = ['categories', 'brand', 'images', 'taxonomies', 'taxonomies.type'];

    public function find(int $id, array $with = []): ?ProductContract
    {

        $relationsToLoad = empty($with) ? $this->allowedRelations : $with;
        $product = Product::with($relationsToLoad)->find($id);

        // trigger Event
        if ($product) {
            \Modules\Product\Events\ProductViewed::dispatch($product); // viewd a single product
        }

        return $product;
    }

    public function search(array $filters): LengthAwarePaginator
    {
        $relationsToLoad = isset($filters['with']) & !empty($filters['with']) ? $filters['with'] : $this->allowedRelations;

        $query = Product::query()->with($relationsToLoad);
        Log::info("Test Data", [$query->toSql()]);

        $filter = new ProductFilter($query, $filters); // filter the query based on the provided filters
        $filteredQuery = $filter->apply();

        return $filteredQuery->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): ProductContract
    {
        return DB::transaction(function () use ($data) {
            $data["slug"] = Str::slug($data["name"]); // create a slug
            $product = Product::create($data);

            if (!empty($data['category_ids'])) {
                $product->categories()->attach($data['category_ids']);
            }

            if (!empty($data['images'])) {
                Log::info("Uploaded Images", [$data['images']]);

                foreach ($data['images'] as $image) {
                    $productImage = ProductImage::find($image["id"] ?? null);
                    if ($productImage) {
                        $productImage->update([
                            'product_id' => $product->id,
                        ]);
                    }
                }
            }

            ProductCreated::dispatch($product);

            return $product;
        });
    }


    // TODO: to be updated
    public function update(ProductContract|Product $product, array $data): ProductContract
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


    public function delete(ProductContract|Product $product): bool
    {
        DB::beginTransaction();

        try {
            // Delete all product images (DB + disk)
            foreach ($product->images as $image) {
                try {
                    Storage::disk('products')->delete($image->url);
                } catch (\Throwable $e) {
                    Log::warning("Failed to delete image file: {$image->url}");
                }
            }
            $product->images()->delete();

            // Detach pivot table relations (not delete related models!)
            $product->categories()->detach();
            $product->taxonomies()->detach();

            // Finally delete product itself
            $result = $product->delete();

            DB::commit();

            if ($result) {
                ProductDeleted::dispatch($product);
            }

            return $result;
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error("Product deletion failed: " . $th->getMessage());
            return false;
        }
    }

    public function addImages(array $images): Collection
    {
        $createdImages = new Collection();

        DB::transaction(function () use ($images, &$createdImages) {
            foreach ($images as $imageFile) {
                if ($imageFile instanceof UploadedFile) {
                    // Store the file and get its relative path. This is what we save.
                    $path = $imageFile->store('products', 'public');

                    // Create the database record for the image.
                    $newImage = ProductImage::create([
                        'url' => $path, // <-- STORE THE RELATIVE PATH, NOT THE FULL URL
                        'is_primary' => false,
                    ]);

                    $createdImages->push($newImage);
                }
            }
        });

        if ($createdImages->isNotEmpty()) {
            ProductImagesUploaded::dispatch($createdImages);
        }

        return $createdImages;
    }

    public function deleteImage($image_id): bool
    {

        $image = ProductImage::find($image_id);

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


    public function deleteImageByUrl(string $image_url): bool
    {
        return true;
    }

}