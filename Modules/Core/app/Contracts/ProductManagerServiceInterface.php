<?php

namespace Modules\Core\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Modules\Core\Contracts\Products\ProductContract;

interface ProductManagerServiceInterface
{


    /**
     * Find a single product by its ID.
     *
     * @param int $id
     * @param array $with - with combinations
     * @return ProductContract|null
     */
    public function find(int $id, array $with = []): ?ProductContract;

    /**
     * Query and filter products based on a set of criteria.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function search(array $filters): LengthAwarePaginator;

    /**
     * Create a new product with its relationships.
     *
     * @param array $data Validated data from the request.
     * @return ProductContract The newly created product instance.
     */
    public function create(array $data): ProductContract;

    /**
     * Update an existing product and its relationships.
     *
     * @param ProductContract $product The product model instance to update.
     * @param array $data Validated data from the request.
     * @return ProductContract The updated product instance.
     */
    public function update(ProductContract $product, array $data): ProductContract;

    /**
     * Delete/archive a product.
     *
     * @param ProductContract $product The product model instance to delete.
     * @return bool True on successful deletion.
     */
    public function delete(ProductContract $product): bool;

    /**
     * Handle uploading and attaching multiple images to a product.
     *
     * @param ProductContract $product
     * @param array $images Array of UploadedFile objects.
     * @return Collection A collection of the newly created ProductImage models.
     */
    public function addImages(array $images): Collection;

    /**
     * Delete a single product image.
     *
     * @param int $image_id The image instance to delete.
     * @return bool
     */
    public function deleteImage(int $image_id): bool;


    /**
     * Delete a single product image.
     *
     * @param string $image_url The image instance to delete.
     * @return bool
     */
    public function deleteImageByUrl(string $image_url): bool;


}