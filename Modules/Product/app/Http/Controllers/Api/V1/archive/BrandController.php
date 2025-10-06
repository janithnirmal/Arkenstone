<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Modules\Core\Contracts\BrandManagerServiceInterface;
use Modules\Product\Http\Requests\StoreBrandRequest;
use Modules\Product\Http\Requests\UpdateBrandRequest;
use Modules\Product\Http\Resources\BrandResource;
use Modules\Product\Models\Brand;

class BrandController extends Controller
{
    protected BrandManagerServiceInterface $brandService;

    public function __construct(BrandManagerServiceInterface $brandService)
    {
        $this->brandService = $brandService;
    }

    public function index(Request $request): JsonResource
    {
        $brands = $this->brandService->queryBrands($request->all());
        return BrandResource::collection($brands);
    }

    public function store(StoreBrandRequest $request): JsonResponse
    {
        $brand = $this->brandService->createBrand($request->validated());
        return (new BrandResource($brand))->response()->setStatusCode(201);
    }

    public function show(Brand $brand): BrandResource
    {
        return new BrandResource($brand);
    }

    public function update(UpdateBrandRequest $request, Brand $brand): BrandResource
    {
        $updatedBrand = $this->brandService->updateBrand($brand, $request->validated());
        return new BrandResource($updatedBrand);
    }

    public function destroy(Brand $brand): JsonResponse
    {
        try {
            $this->brandService->deleteBrand($brand);
            return response()->json(null, 204);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }
    }
}