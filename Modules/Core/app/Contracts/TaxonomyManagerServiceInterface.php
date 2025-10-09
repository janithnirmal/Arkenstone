<?php

namespace Modules\Core\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Modules\Product\Models\Product;
use Modules\Product\Models\Taxonomy;
use Modules\Product\Models\TaxonomyType;

interface TaxonomyManagerServiceInterface
{
    // Types
    public function listTypes(array $filters=[]): LengthAwarePaginator;
    public function createType(array $data): TaxonomyType;
    public function updateType(TaxonomyType $type, array $data): TaxonomyType;
    public function deleteType(TaxonomyType $type): bool;

    // Taxonomies
    public function listTaxonomies(array $filters=[]): LengthAwarePaginator;
    public function createTaxonomy(array $data): Taxonomy;
    public function updateTaxonomy(Taxonomy $taxonomy, array $data): Taxonomy;
    public function deleteTaxonomy(Taxonomy $taxonomy): bool;

    // Linking
    public function attachToProduct(Product $product, array $taxonomyIds): void;
    public function syncForProduct(Product $product, array $taxonomyIds): void;
    public function detachFromProduct(Product $product, int $taxonomyId): void;

    public function getProductTaxonomies(Product $product, ?int $typeId = null);
    public function getProductsByTaxonomy(Taxonomy $taxonomy, array $with = []);
}
