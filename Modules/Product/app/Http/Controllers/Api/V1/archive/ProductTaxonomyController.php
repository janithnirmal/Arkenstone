<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Http\Requests\AttachTaxonomiesToProductRequest;


//TODO: Add Request Validation and rules where necessary

class ProductTaxonomyController extends Controller
{

    public function __construct(private TaxonomyManagerServiceInterface $service)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json($this->service->listTaxonomies(request()->all()));
    }

    /**
     * Attach taxonomies to a product.
     */
    public function attach(AttachTaxonomiesToProductRequest $request, $productId)
    {
        $this->service->attachToProduct($productId, $request->validated()['taxonomy_ids']);
        return response()->json(null, 204);

    }

    /**
     * Sync taxonomies for a product.
     */
    public function sync(AttachTaxonomiesToProductRequest $request, $productId)
    {
        $this->service->syncForProduct($productId, $request->validated()['taxonomy_ids']);
        return response()->json(null, 204);
    }

    /**
     * Detach a taxonomy from a product.
     */
    public function detach(Request $request, $productId, $taxonomyId)
    {
        $this->service->detachFromProduct($productId, $taxonomyId);
        return response()->json(null, 204);
    }

    /**
     * Get taxonomies for a product.
     */
    public function productTaxonomies(Request $request, $productId)
    {
        $typeId = $request->query('type_id');
        $taxonomies = $this->service->getProductTaxonomies($productId, $typeId);
        return response()->json($taxonomies);

    }

    /**
     * Get products for a taxonomy.
     */
    public function taxonomyProducts(Request $request, $taxonomyId)
    {
        $with = $request->query('with', []);
        $products = $this->service->getProductsByTaxonomy($taxonomyId, $with);
        return response()->json($products);
    }

}
