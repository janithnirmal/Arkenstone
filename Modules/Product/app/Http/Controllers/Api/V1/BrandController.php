<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Helpers\ResponseProtocol;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Modules\Core\Contracts\BrandManagerServiceInterface;
use Modules\Product\Http\Requests\StoreBrandRequest;
use Modules\Product\Http\Requests\UpdateBrandRequest;
use Modules\Product\Http\Resources\BrandCollection;
use Modules\Product\Http\Resources\BrandResource;
use Modules\Product\Models\Brand;

class BrandController extends Controller
{
    protected BrandManagerServiceInterface $brandService;

    public function __construct(BrandManagerServiceInterface $brandService)
    {
        $this->brandService = $brandService;
    }

    public function index(Request $request): JsonResponse
    {
        $brands = $this->brandService->queryBrands($request->all());
        return ResponseProtocol::success(new BrandCollection($brands));
    }

    public function store(StoreBrandRequest $request): JsonResponse
    {
        $brand = $this->brandService->createBrand($request->validated());
        return ResponseProtocol::success(new BrandResource($brand), 'Brand created successfully.', 201);
    }

    public function show(Brand $brand): BrandResource
    {
        return new BrandResource($brand);
    }

    public function update(UpdateBrandRequest $request, Brand $brand): JsonResponse
    {
        $updatedBrand = $this->brandService->updateBrand($brand, $request->validated());
        return ResponseProtocol::success(new BrandResource($updatedBrand), 'Brand updated successfully.');
    }

    public function destroy(Brand $brand): JsonResponse
    {
        try {
            $this->brandService->deleteBrand($brand);
            return ResponseProtocol::success(null, 'Brand deleted successfully.');
        } catch (ValidationException $e) {
            return ResponseProtocol::error($e->getMessage(), 409);
        }
    }
}