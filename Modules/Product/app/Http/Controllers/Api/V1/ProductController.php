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
use Modules\Product\Http\Requests\DeleteProductImagesRequest;
use Modules\Product\Http\Requests\DestoryProductRequest;
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
            Log::info("Fetched Product", [$products]);
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

    public function destroy(DestoryProductRequest $request): JsonResponse
    {
        $product = Product::withTrashed()->find($request->id);
        $deletedProduct = $this->productService->delete($product);
        return ResponseProtocol::success($deletedProduct, "Product Deleted SuccessFully!");
    }

    /**
     * Handle file uploads for a specific product.
     */
    public function uploadImages(UploadProductImagesRequest $request): JsonResponse
    {
        $newImages = $this->productService->addImages([$request->validated()['image']]);
        return ResponseProtocol::success(new ProductImageResource($newImages[0]), "Images uploaded successfully.");
    }

    public function destroyImage(DeleteProductImagesRequest $request): JsonResponse
    {
        $this->productService->deleteImage($request->validated());
        return ResponseProtocol::success(null, 'Image Removed Successfully');
    }

}