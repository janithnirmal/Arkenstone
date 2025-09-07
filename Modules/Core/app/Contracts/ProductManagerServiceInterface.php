<?php

namespace Modules\Core\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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
}