<?php

namespace Modules\Product\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;


use Modules\Product\Models\Product;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Models\Taxonomy;
use Modules\Product\Models\TaxonomyType;

class TaxonomyService implements TaxonomyManagerServiceInterface
{
    //Types
    public function listTypes(array $filters = []): LengthAwarePaginator
    {
        $q = TaxonomyType::query();
        if (!empty($filters['search'])) {
            $q->where('name', 'like', '%' . $filters['search'] . '%');
        }
        return $q->paginate($filters['per_page'] ?? 15);
    }

    public function createType(array $data): TaxonomyType
    {
        return TaxonomyType::create($data);
    }

    public function updateType(TaxonomyType $type, array $data): TaxonomyType
    {
        $type->update($data);
        return $type->fresh();
    }

    public function deleteType(TaxonomyType $type): bool
    {
        return $type->delete();
    }

    //Taxonomies
    public function listTaxonomies(array $filters = []): LengthAwarePaginator
    {
        $q = Taxonomy::query()->with(['type', 'parent', 'children']);
        if (isset($filters['taxonomy_type_id'])) {
            $q->where('taxonomy_type_id', $filters['taxonomy_type_id']);
        }
        if (isset($filters['type_slug'])) {
            $q->whereHas('type', fn($qq) => $qq->where('slug', $filters['type_slug']));
        }
        if (isset($filters['parent_id'])) {
            $q->where('parent_id', $filters['parent_id']);
        }
        if (!empty($filters['root_only'])) {
            $q->whereNull('parent_id');
        }
        if (!empty($filters['search'])) {
            $q->where('name', 'like', '%' . $filters['search'] . '%');
        }
        return $q->paginate($filters['per_page'] ?? 15);
    }

    public function createTaxonomy(array $data): Taxonomy
    {
        return DB::transaction(function () use ($data) {
            return Taxonomy::create($data);
        });
    }

    public function updateTaxonomy(Taxonomy $taxonomy, array $data): Taxonomy
    {
        $taxonomy->update($data);
        return $taxonomy->fresh();
    }

    public function deleteTaxonomy(Taxonomy $taxonomy): bool
    {
        return $taxonomy->delete();
    }

    //Product-Taxonomy Relations

    public function attachToProduct(Product $product, array $taxonomyIds): void
    {
        $product->taxonomies()->attach($taxonomyIds);
    }

    public function syncForProduct(Product $product, array $taxonomyIds): void
    {
        $product->taxonomies()->sync($taxonomyIds);
    }

    public function detachFromProduct(Product $product, int $taxonomyId): void
    {
        $product->taxonomies()->detach($taxonomyId);
    }

    public function getProductTaxonomies(Product $product, ?int $typeId = null)
    {
        $rel = $product->taxonomies()->with('type');
        if ($typeId)
            $rel->where('taxonomy_type_id', $typeId);
        return $rel->get();
    }

    public function getProductsByTaxonomy(Taxonomy $taxonomy, array $with = [])
    {
        return $taxonomy->products()->with($with)->paginate(15);
    }
}