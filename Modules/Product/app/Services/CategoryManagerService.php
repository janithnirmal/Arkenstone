<?php

namespace Modules\Product\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;
use Modules\Core\Contracts\CategoryContract;
use Modules\Core\Contracts\CategoryManagerServiceInterface;
use Modules\Product\Events\CategoryCreated;
use Modules\Product\Events\CategoryDeleted;
use Modules\Product\Events\CategoryUpdated;
use Modules\Product\Models\Category;

class CategoryManagerService implements CategoryManagerServiceInterface
{
    public function getAllCategories(): Collection
    {
        // Fetch only parent categories and eager load their children recursively
        return Category::whereNull('parent_id')
            ->with(['children.children'])
            ->get();
    }

    public function findCategory(int $id): ?CategoryContract
    {
        return Category::with(['parent', 'children'])->find($id);
    }

    public function createCategory(array $data): CategoryContract
    {
        $category = Category::create($data);

        CategoryCreated::dispatch($category);

        return $category;
    }

    /**
     * @param Category $category The CONCRETE Eloquent model
     * @param array $data
     * @return CategoryContract
     */
    public function updateCategory(CategoryContract|Category $category, array $data): CategoryContract
    {
        $category->update($data);
        $updatedCategory = $category->fresh(['parent', 'children']); // Now valid
        CategoryUpdated::dispatch($updatedCategory);
        return $updatedCategory;
    }

    /**
     * @param Category $category The CONCRETE Eloquent model
     * @return bool
     */
    public function deleteCategory(CategoryContract|Category $category): bool
    {
        if ($category->products()->exists()) { 
            throw ValidationException::withMessages([
                'category' => 'Cannot delete category. It has associated products.'
            ]);
        }

        if ($category->children()->exists()) { 
            throw ValidationException::withMessages([
                'category' => 'Cannot delete category. Please delete its sub-categories first.'
            ]);
        }

        $result = $category->delete();
        if ($result) {
            CategoryDeleted::dispatch($category);
        }
        return $result;
    }
}