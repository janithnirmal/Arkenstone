<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Modules\Product\Http\Requests\StoreCategoryRequest;
use Modules\Product\Http\Requests\UpdateCategoryRequest;
use Modules\Product\Http\Resources\CategoryResource;
use Modules\Product\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * Fetches top-level categories with their children.
     */
    public function index(): JsonResource
    {
        // Fetch only parent categories and eager load their children and grandchildren
        $categories = Category::whereNull('parent_id')
            ->with(['children.children']) // Load children and their children
            ->get();

        return CategoryResource::collection($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return (new CategoryResource($category))
                ->response()
                ->setStatusCode(201); // 201 Created
    }

    /**
     * Display the specified resource.
     * Includes the category's children and parent.
     */
    public function show(Category $category): CategoryResource
    {
        // Eager load relationships for the single view
        $category->load(['parent', 'children']);

        return new CategoryResource($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());

        // Load relationships to show the updated state
        $category->load(['parent', 'children']);

        return (new CategoryResource($category))
                ->response()
                // setStatusCode is not needed here as 200 OK is the default
                ->setStatusCode(200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): JsonResponse
    {
        // Check if the category has products associated with it
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category. It has associated products.'
            ], 409); // 409 Conflict
        }

        // Check if the category has sub-categories
        if ($category->children()->exists()) {
             return response()->json([
                'message' => 'Cannot delete category. Please delete its sub-categories first.'
            ], 409); // 409 Conflict
        }

        $category->delete(); // This uses soft delete

        return response()->json(null, 204); // 204 No Content
    }
}