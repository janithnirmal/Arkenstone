<?php

namespace Modules\Product\Contracts;

use Modules\Product\Models\Product;

interface ProductManagerServiceInterface
{

    public function find(int $id);

    /**
     * Query and filter products based on a set of criteria.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function queryProducts(array $filters);
    /**
     * Create a new product with its relationships.
     *
     * @param array $data Validated data from the request.
     * @return Product The newly created product instance.
     */
    public function createProduct(array $data): Product;

    /**
     * Update an existing product and its relationships.
     *
     * @param Product $product The product model instance to update.
     * @param array $data Validated data from the request.
     * @return Product The updated product instance.
     */
    public function updateProduct(Product $product, array $data): Product;

    /**
     * Delete a product and its associated assets (like images).
     *
     * @param Product $product The product model instance to delete.
     * @return bool True on successful deletion.
     */
    public function deleteProduct(Product $product): bool;
}
