<?php

namespace Modules\Core\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BrandManagerServiceInterface
{
    public function queryBrands(array $filters): LengthAwarePaginator;
    public function findBrand(int $id): ?BrandContract;
    public function createBrand(array $data): BrandContract;
    public function updateBrand(BrandContract $brand, array $data): BrandContract;
    public function deleteBrand(BrandContract $brand): bool;
}