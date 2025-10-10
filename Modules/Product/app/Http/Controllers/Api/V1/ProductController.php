<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Helpers\ResponseProtocol;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Modules\Product\Http\Requests\QueryProductRequest;
use Modules\Product\Models\Product;
use Modules\Product\Models\ProductImage;
use Modules\Core\Contracts\ProductManagerServiceInterface;
use Modules\Product\Http\Requests\StoreProductRequest;
use Modules\Product\Http\Requests\UpdateProductRequest;
use Modules\Product\Http\Resources\ProductCollection;
use Modules\Product\Http\Resources\ProductResource;
use Modules\Product\Http\Requests\UploadProductImagesRequest;
use Modules\Product\Http\Resources\ProductImageResource;
use Modules\Product\Http\Resources\ProductResourceCollection;

class ProductController extends Controller
{
    protected ProductManagerServiceInterface $productService;

    public function __construct(ProductManagerServiceInterface $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Fetch product(s) based on query parameters.
     * @return JsonResponse
     */
    public function index(QueryProductRequest $request): JsonResponse
    {
        if ($request->has(["id"])) {
            $product = $this->productService->find($request->id, $request->get('with', []));
            return ResponseProtocol::success(new ProductResource($product));
        } else {
            $products = $this->productService->search($request->validated());
            return ResponseProtocol::success(new ProductResourceCollection($products));
        }
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->create($request->validated());
        return ResponseProtocol::success(new ProductResource($product), 201);
    }

    public function show(Product $product): ProductResource
    {
        // The findProduct service method is implicitly called by Laravel's route model binding.
        // We can dispatch the event here if we don't want to rely on the service's find method.
        // Or, we can use the service explicitly:
        $foundProduct = $this->productService->find($product->id);
        return new ProductResource($foundProduct);
    }

    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $updatedProduct = $this->productService->update($product, $request->validated());
        return new ProductResource($updatedProduct);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->productService->delete($product);
        return response()->json(null, 204);
    }

    /**
     * Handle file uploads for a specific product.
     */
    public function uploadImages(UploadProductImagesRequest $request, Product $product): JsonResponse
    {
        $newImages = $this->productService->addImages(
            $product,
            $request->validated()['images']
        );

        return ProductImageResource::collection($newImages)
            ->additional(['message' => 'Images uploaded successfully.'])
            ->response()
            ->setStatusCode(201);
    }

    public function destroyImage(ProductImage $product_image): JsonResponse
    {
        // Add authorization check here to ensure user can delete this image.
        $this->productService->deleteImage($product_image);
        return response()->json(null, 204);
    }

}