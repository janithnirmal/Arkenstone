<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Product\Models\Product;
use Modules\Product\Models\ProductVariant;
use Modules\Product\Models\ProductImage;
use Modules\Core\Contracts\ProductManagerServiceInterface;
use Modules\Product\Http\Requests\StoreProductRequest;
use Modules\Product\Http\Requests\UpdateProductRequest;
use Modules\Product\Http\Resources\ProductCollection;
use Modules\Product\Http\Resources\ProductResource;
use Modules\Product\Http\Requests\UploadProductImagesRequest;
use Modules\Product\Http\Resources\ProductImageResource;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\Product\Http\Requests\UpdateProductStockRequest;

class ProductController extends Controller
{
    protected ProductManagerServiceInterface $productService;

    public function __construct(ProductManagerServiceInterface $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request): ProductCollection
    {
        $products = $this->productService->queryProducts($request->all());
        return new ProductCollection($products);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct($request->validated());
        return (new ProductResource($product->load(['brand', 'categories', 'images', 'variants.attributeValues.attribute'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Product $product): ProductResource
    {
        // The findProduct service method is implicitly called by Laravel's route model binding.
        // We can dispatch the event here if we don't want to rely on the service's find method.
        // Or, we can use the service explicitly:
        $foundProduct = $this->productService->findProduct($product->id);
        return new ProductResource($foundProduct);
    }

    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $updatedProduct = $this->productService->updateProduct($product, $request->validated());
        return new ProductResource($updatedProduct->load(['brand', 'categories', 'images', 'variants.attributeValues.attribute']));
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->productService->deleteProduct($product);
        return response()->json(null, 204);
    }
    
    /**
     * Handle file uploads for a specific product.
     */
    public function uploadImages(UploadProductImagesRequest $request, Product $product): JsonResponse
    {
        $newImages = $this->productService->addImagesToProduct(
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

    /**
     * Update the stock for a specific product.
     */
    public function updateStock(UpdateProductStockRequest $request, Product $product): ProductResource
    {
        $updatedProduct = $this->productService->updateProductStock(
            $product,
            $request->validated()['stock']
        );
        return new ProductResource($updatedProduct);
    }
    
}