<?php

namespace Modules\Product\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Product\Models\Product;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Models\ProductTaxonomy;
use Modules\Product\Models\Taxonomy;
use Modules\Product\Models\TaxonomyType;

class TaxonomyManagerService implements TaxonomyManagerServiceInterface
{
    public function listTypes(array $filters = []): Collection
    {
        $q = TaxonomyType::query();

        // By default, we include taxonomies.
        // We only skip loading them if 'only_taxonomy_type' is explicitly true.
        if (empty($filters['only_taxonomy_type'])) {
            $q->with('taxonomies');
        }

        // --- Apply other existing filters ---

        // Filter by the name of the Taxonomy Type
        if (!empty($filters['search'])) {
            $q->where('name', 'like', '%' . $filters['search'] . '%');
        }

        // Filter by a specific Taxonomy Type ID
        if (isset($filters['taxonomy_type_id'])) {
            $q->where('id', $filters['taxonomy_type_id']);
        }

        // Filter Taxonomy Types that have a Taxonomy with a specific name
        if (!empty($filters['taxonomy_name'])) {
            $q->whereHas('taxonomies', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['taxonomy_name'] . '%');
            });
        }

        return $q->get();
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
        $taxonomy->delete();
        return true;

    }

    //Product-Taxonomy Relations
    //Product-Taxonomy Relations
    public function attachToProduct(Product $product, array $taxonomyIds): void
    {
        // Attach an array of taxonomy IDs to the product
        $product->taxonomies()->attach($taxonomyIds);
    }

    public function syncForProduct(Product $product, array $taxonomyIds): void
    {
        // Sync ensures only the provided IDs are attached, detaching any others.
        $product->taxonomies()->sync($taxonomyIds);
    }

    // Detach a specific taxonomy from a product
    public function detachFromProduct(Product $product, Taxonomy $taxonomy): void
    {
        // Detach a single taxonomy ID
        $product->taxonomies()->detach($taxonomy->id);
    }

    public function getProductsByTaxonomy(Taxonomy $taxonomy, array $with = [])
    {
        return $taxonomy->products()->with($with)->paginate(15);
    }


    public function getProductTaxonomies(Product $product, ?int $typeId = null)
    {
        $rel = $product->taxonomies()->with('type');
        if ($typeId)
            $rel->where('taxonomy_type_id', $typeId);
        return $rel->get();
    }
}