<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Modules\Product\Http\Requests\StoreBrandRequest;
use Modules\Product\Http\Requests\UpdateBrandRequest;
use Modules\Product\Http\Resources\BrandResource;
use Modules\Product\Models\Brand;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResource
    {
        // Add simple pagination for brands list
        $brands = Brand::latest()->paginate($request->get('limit', 15));

        return BrandResource::collection($brands);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrandRequest $request): JsonResponse
    {
        $brand = Brand::create($request->validated());

        return (new BrandResource($brand))
                ->response()
                ->setStatusCode(201); // 201 Created
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand): BrandResource
    {
        return new BrandResource($brand);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrandRequest $request, Brand $brand): BrandResource
    {
        $brand->update($request->validated());

        return new BrandResource($brand);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand): JsonResponse
    {
        // Optional: Prevent deletion if the brand is associated with products
        if ($brand->products()->exists()) {
            return response()->json([
                'message' => 'Cannot delete brand. It has associated products.'
            ], 409); // 409 Conflict
        }

        $brand->delete(); // This uses soft deletes

        return response()->json(null, 204); // 204 No Content
    }
}