<?php

namespace Modules\Core\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface CategoryManagerServiceInterface
{
    public function getAllCategories(): Collection;
    public function findCategory(int $id): ?CategoryContract;
    public function createCategory(array $data): CategoryContract;
    public function updateCategory(CategoryContract $category, array $data): CategoryContract;
    public function deleteCategory(CategoryContract $category): bool;
}