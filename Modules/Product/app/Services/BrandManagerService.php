<?php

namespace Modules\Product\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;
use Modules\Core\Contracts\BrandContract;
use Modules\Core\Contracts\BrandManagerServiceInterface;
use Modules\Product\Events\BrandCreated;
use Modules\Product\Events\BrandDeleted;
use Modules\Product\Events\BrandUpdated;
use Modules\Product\Models\Brand;

class BrandManagerService implements BrandManagerServiceInterface
{
    public function queryBrands(array $filters): LengthAwarePaginator
    {
        return Brand::latest()->paginate($filters['limit'] ?? 15);
    }

    public function findBrand(int $id): ?BrandContract
    {
        return Brand::find($id);
    }

    public function createBrand(array $data): BrandContract
    {
        $brand = Brand::create($data);

        BrandCreated::dispatch($brand);

        return $brand;
    }

     /**
     * @param Brand $brand The CONCRETE Eloquent model
     * @param array $data
     * @return BrandContract
     */
    public function updateBrand(BrandContract|Brand $brand, array $data): BrandContract
    {
        $brand->update($data);
        $updatedBrand = $brand->fresh(); 
        BrandUpdated::dispatch($updatedBrand);
        return $updatedBrand;
    }

    /**
     * @param Brand $brand The CONCRETE Eloquent model
     * @return bool
     */
    public function deleteBrand(BrandContract|Brand $brand): bool
    {
        if ($brand->products()->exists()) { // Now valid
            throw ValidationException::withMessages([
                'brand' => 'Cannot delete brand. It has associated products.'
            ]);
        }

        $result = $brand->delete();
        if ($result) {
            BrandDeleted::dispatch($brand);
        }
        return $result;
    }
}