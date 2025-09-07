<?php

namespace Modules\Core\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ProductManagerServiceInterface
{
    /**
     * Find a single product by its ID.
     *
     * @param int $id
     * @return ProductContract|null
     */
    public function findProduct(int $id): ?ProductContract;

    /**
     * Query and filter products based on a set of criteria.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function queryProducts(array $filters): LengthAwarePaginator;

    /**
     * Create a new product with its relationships.
     *
     * @param array $data Validated data from the request.
     * @return ProductContract The newly created product instance.
     */
    public function createProduct(array $data): ProductContract;

    /**
     * Update an existing product and its relationships.
     *
     * @param ProductContract $product The product model instance to update.
     * @param array $data Validated data from the request.
     * @return ProductContract The updated product instance.
     */
    public function updateProduct(ProductContract $product, array $data): ProductContract;

    /**
     * Delete/archive a product.
     *
     * @param ProductContract $product The product model instance to delete.
     * @return bool True on successful deletion.
     */
    public function deleteProduct(ProductContract $product): bool;

    public function createProductVariant(ProductContract $product, array $data): ProductVariantContract;
    public function updateProductVariant(ProductVariantContract $variant, array $data): ProductVariantContract;
    public function deleteProductVariant(ProductVariantContract $variant): bool;

    /**
     * Handle uploading and attaching multiple images to a product.
     *
     * @param ProductContract $product
     * @param array $images Array of UploadedFile objects.
     * @return Collection A collection of the newly created ProductImage models.
     */
    public function addImagesToProduct(ProductContract $product, array $images): Collection;

    /**
     * Delete a single product image.
     *
     * @param ProductImageContract $image The image instance to delete.
     * @return bool
     */
    public function deleteImage(ProductImageContract $image): bool;

    /**
     * Updates the stock for a simple product.
     *
     * @param ProductContract $product
     * @param int $quantity
     * @return ProductContract
     */
    public function updateProductStock(ProductContract $product, int $quantity): ProductContract;

    /**
     * Updates the stock for a specific product variant.
     *
     * @param ProductVariantContract $variant
     * @param int $quantity
     * @return ProductVariantContract
     */
    public function updateVariantStock(ProductVariantContract $variant, int $quantity): ProductVariantContract;
}