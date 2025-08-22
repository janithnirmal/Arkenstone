<?php

namespace Modules\Product\app\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Modules\Core\Contracts\ProductManagerServiceInterface;
use Modules\Product\Events\ProductViewed;
use Modules\Product\Models\Product;

class ProductManagerService implements ProductManagerServiceInterface
{

    public function find(int $id)
    {
        Log::info("Message", [event(new ProductViewed(Product::find(1)))]);
        return " This is the Name : " . "";
    }

    // public function find(int $id)
    // {
    //     return Product::with(['categories', 'terms.taxonomy', 'images'])->find($id);
    // }


    // public function queryProducts(array $filters)
    // {
    //     // Start with a base query, eager-loading all necessary relationships
    //     // to prevent N+1 problems in the API resource.
    //     $query = Product::with(['categories', 'terms.taxonomy', 'images']);

    //     // Filter by category IDs
    //     $query->when($filters['categories'] ?? null, function (Builder $q, $categoryIds) {
    //         $q->whereHas('categories', function (Builder $subQ) use ($categoryIds) {
    //             $subQ->whereIn('id', $categoryIds);
    //         });
    //     });

    //     // Filter by taxonomy term IDs (AND logic)
    //     // This ensures the product has ALL the specified terms.
    //     $query->when($filters['taxonomies'] ?? null, function (Builder $q, $termIds) {
    //         $q->whereHas('terms', function (Builder $subQ) use ($termIds) {
    //             $subQ->whereIn('id', $termIds);
    //         }, '=', count($termIds));
    //     });

    //     // Filter by price range
    //     $query->when($filters['min_price'] ?? null, function (Builder $q, $minPrice) {
    //         $q->where('price', '>=', $minPrice);
    //     });

    //     $query->when($filters['max_price'] ?? null, function (Builder $q, $maxPrice) {
    //         $q->where('price', '<=', $maxPrice);
    //     });

    //     // Apply sorting
    //     $this->applySorting($query, $filters['sort_by'] ?? null);

    //     // Paginate the results
    //     return $query->paginate($filters['per_page'] ?? 15);
    // }

    // protected function applySorting(Builder $query, ?string $sortBy): void
    // {
    //     switch ($sortBy) {
    //         case 'price_asc':
    //             $query->orderBy('price', 'asc');
    //             break;
    //         case 'price_desc':
    //             $query->orderBy('price', 'desc');
    //             break;
    //         case 'name_asc':
    //             $query->orderBy('name', 'asc');
    //             break;
    //         case 'name_desc':
    //             $query->orderBy('name', 'desc');
    //             break;
    //         default:
    //             $query->orderBy('created_at', 'desc');
    //             break;
    //     }
    // }

    // public function createProduct(array $data): Product
    // {
    //     // Use a transaction to ensure data integrity. If any step fails,
    //     // the entire operation is rolled back.
    //     return DB::transaction(function () use ($data) {
    //         // 1. Create the base product record.
    //         $productData = [
    //             'name' => $data['name'],
    //             'slug' => Str::slug($data['name']), // Auto-generate slug
    //             'description' => $data['description'] ?? '',
    //             'price' => $data['price'] ?? 0,
    //             'stock_quantity' => $data['stock_quantity'] ?? 0,
    //         ];
    //         $product = Product::create($productData);

    //         // 2. Attach categories if they are provided.
    //         if (!empty($data['categories'])) {
    //             $product->categories()->attach($data['categories']);
    //         }

    //         // 3. Attach taxonomy terms if they are provided.
    //         if (!empty($data['terms'])) {
    //             $product->terms()->attach($data['terms']);
    //         }

    //         // 4. Handle image uploads.
    //         if (!empty($data['images'])) {
    //             $this->handleImageUploads($product, $data['images']);
    //         }

    //         // Return the newly created product with its relationships loaded.
    //         return $product->load(['categories', 'terms', 'images']);
    //     });
    // }

    // public function updateProduct(ProductContract $product, array $data): ProductContract
    // {
    //     return DB::transaction(function () use ($product, $data) {
    //         // 1. Update the core product attributes.
    //         $productData = [
    //             'name' => $data['name'],
    //             'slug' => Str::slug($data['name']),
    //             'description' => $data['description'],
    //             'price' => $data['price'],
    //             'stock_quantity' => $data['stock_quantity'],
    //         ];
    //         $product->update($productData);

    //         // 2. Sync categories. `sync` is efficient: it attaches new,
    //         // detaches missing, and leaves existing ones untouched.
    //         if (isset($data['categories'])) {
    //             $product->categories()->sync($data['categories']);
    //         }

    //         // 3. Sync taxonomy terms.
    //         if (isset($data['terms'])) {
    //             $product->terms()->sync($data['terms']);
    //         }

    //         // 4. Handle new image uploads.
    //         if (!empty($data['images'])) {
    //             $this->handleImageUploads($product, $data['images']);
    //         }

    //         // 5. Handle image deletions.
    //         if (!empty($data['images_to_delete'])) {
    //             $this->handleImageDeletions($product, $data['images_to_delete']);
    //         }

    //         // 6. Handle changing the primary image
    //         if (isset($data['primary_image_id'])) {
    //             $this->setPrimaryImage($product, $data['primary_image_id']);
    //         }

    //         // Return the updated product with fresh data from the database.
    //         return $product->fresh(['categories', 'terms', 'images']);
    //     });
    // }

    // public function deleteProduct(Product $product): bool
    // {
    //     return DB::transaction(function () use ($product) {
    //         // Crucially, before deleting the product from the database,
    //         // we must delete all its associated image files from storage
    //         // to prevent orphaned files.

    //         foreach ($product->images as $image) {
    //             Storage::disk('products')->delete($image->path);
    //         }

    //         // The database's `onDelete('cascade')` will handle deleting
    //         // pivot table entries and product_images records.
    //         // Our job is to clean up the files that Eloquent doesn't know about.
    //         return $product->delete();
    //     });
    // }

    // /**
    //  * A private helper method to handle storing uploaded images.
    //  */
    // private function handleImageUploads(Product $product, array $images): void
    // {
    //     foreach ($images as $imageFile) {
    //         if ($imageFile instanceof UploadedFile) {
    //             // Store the file in `storage/app/public/products`
    //             // and get its relative path.
    //             $path = $imageFile->store('products', 'public');

    //             $product->images()->create([
    //                 'path' => $path,
    //                 // You can extend the request to include alt text for each image.
    //                 'alt_text' => $product->name,
    //                 // By default, newly uploaded images are not primary.
    //                 'is_primary' => false,
    //             ]);
    //         }
    //     }
    // }

    // /**
    //  * A private helper method to handle deleting images.
    //  */
    // private function handleImageDeletions(Product $product, array $imageIds): void
    // {
    //     $imagesToDelete = $product->images()->whereIn('id', $imageIds)->get();

    //     foreach ($imagesToDelete as $image) {
    //         // 1. Delete the physical file from storage.
    //         Storage::disk('products')->delete($image->path);
    //         // 2. Delete the database record.
    //         $image->delete();
    //     }
    // }

    // /**
    //  * A private helper method to set the primary image.
    //  */
    // private function setPrimaryImage(Product $product, int $newPrimaryImageId): void
    // {
    //     // 1. Unset the current primary image.
    //     $product->images()->where('is_primary', true)->update(['is_primary' => false]);

    //     // 2. Set the new primary image.
    //     $product->images()->where('id', $newPrimaryImageId)->update(['is_primary' => true]);
    // }
}