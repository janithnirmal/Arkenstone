<?php

namespace Modules\Core\Contracts;

use Modules\Core\Contracts\ProductContract;

interface ProductManagerServiceInterface
{

    public function find(int $id);


    // public function find(int $id);

    // /**
    //  * Query and filter products based on a set of criteria.
    //  *
    //  * @param array $filters
    //  * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
    //  */
    // public function queryProducts(array $filters);
    // /**
    //  * Create a new product with its relationships.
    //  *
    //  * @param array $data Validated data from the request.
    //  * @return ProductContract The newly created product instance.
    //  */
    // public function createProduct(array $data): ProductContract;

    // /**
    //  * Update an existing product and its relationships.
    //  *
    //  * @param ProductContract $product The product model instance to update.
    //  * @param array $data Validated data from the request.
    //  * @return ProductContract The updated product instance.
    //  */
    // public function updateProduct(ProductContract $product, array $data): ProductContract;

    // /**
    //  * Delete a product and its associated assets (like images).
    //  *
    //  * @param ProductContract $product The product model instance to delete.
    //  * @return bool True on successful deletion.
    //  */
    // public function deleteProduct(ProductContract $product): bool;
}
