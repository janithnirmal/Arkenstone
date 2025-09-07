<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Modules\Core\Contracts\ProductManagerServiceInterface;
use Modules\Product\Http\Resources\ProductVariantResource;
use Modules\Product\Models\Product;
use Modules\Product\Models\ProductVariant;
use Modules\Product\Http\Requests\StoreProductVariantRequest;
use Modules\Product\Http\Requests\UpdateProductVariantRequest;

class ProductVariantController extends Controller
{
    protected ProductManagerServiceInterface $productService;

    public function __construct(ProductManagerServiceInterface $productService)
    {
        $this->productService = $productService;
    }

    public function store(StoreProductVariantRequest $request, Product $product): JsonResponse
    {
        $variant = $this->productService->createProductVariant($product, $request->validated());
        return (new ProductVariantResource($variant))->response()->setStatusCode(201);
    }

    public function update(UpdateProductVariantRequest $request, ProductVariant $variant): ProductVariantResource
    {
        $updatedVariant = $this->productService->updateProductVariant($variant, $request->validated());
        return new ProductVariantResource($updatedVariant);
    }

    public function destroy(ProductVariant $variant): JsonResponse
    {
        $this->productService->deleteProductVariant($variant);
        return response()->json(null, 204);
    }
}