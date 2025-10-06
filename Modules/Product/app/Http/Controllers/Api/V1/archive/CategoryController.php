<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Modules\Core\Contracts\CategoryManagerServiceInterface;
use Modules\Product\Http\Requests\StoreCategoryRequest;
use Modules\Product\Http\Requests\UpdateCategoryRequest;
use Modules\Product\Http\Resources\CategoryResource;
use Modules\Product\Models\Category;

class CategoryController extends Controller
{
    protected CategoryManagerServiceInterface $categoryService;

    public function __construct(CategoryManagerServiceInterface $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(): JsonResource
    {
        $categories = $this->categoryService->getAllCategories();
        return CategoryResource::collection($categories);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->createCategory($request->validated());
        return (new CategoryResource($category))->response()->setStatusCode(201);
    }

    public function show(Category $category): CategoryResource
    {
        // Route model binding already finds the category, so we can just return it.
        // The service's find method is more for internal use or if you don't use route-model binding.
        return new CategoryResource($category->load(['parent', 'children']));
    }

    public function update(UpdateCategoryRequest $request, Category $category): CategoryResource
    {
        $updatedCategory = $this->categoryService->updateCategory($category, $request->validated());
        return new CategoryResource($updatedCategory);
    }

    public function destroy(Category $category): JsonResponse
    {
        try {
            $this->categoryService->deleteCategory($category);
            return response()->json(null, 204);
        } catch (ValidationException $e) {
            // Return a 409 Conflict status code with the validation message from the service
            return response()->json(['message' => $e->getMessage()], 409);
        }
    }
}