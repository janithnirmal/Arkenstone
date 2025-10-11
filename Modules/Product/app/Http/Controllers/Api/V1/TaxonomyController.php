<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Helpers\ResponseProtocol;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Http\Requests\StoreTaxonomyRequest;
use Modules\Product\Http\Requests\UpdateTaxonomyRequest;
use Modules\Product\Http\Resources\ProductResource;
use Modules\Product\Http\Resources\TaxonomyCollection;
use Modules\Product\Http\Resources\TaxonomyResource;
use Modules\Product\Models\Taxonomy;

/**
 * -------------------------------------------------------------------------------------
 * @group Taxonomies
 * APIs for managing product taxonomies (categories, tags, etc.)
 * 
 * A Taxonomy represents a classification or grouping of products, such as categories or tags.
 * This controller provides endpoints to create, update, delete, and list taxonomies.
 * 
 * @authenticated
 * 
 * @header Authorization Bearer {token}
 * 
 * @apiResourceCollection Modules\Product\Http\Resources\TaxonomyCollection
 * @apiResourceModel Modules\Product\Models\Taxonomy
 * -------------------------------------------------------------------------------------
 */

class TaxonomyController extends Controller
{

    public function __construct(private TaxonomyManagerServiceInterface $service)
    {
    }

    // GET /taxonomies
    public function index()
    {
        $taxonomies = $this->service->listTaxonomies(request()->all());
        // return ResponseProtocol::success(new TaxonomyCollection($taxonomies),"Taxonomies retrieved successfully.");
        return new TaxonomyCollection($taxonomies);
    }

    // POST /taxonomies
    public function store(StoreTaxonomyRequest $request)
    {
        $taxonomy = $this->service->createTaxonomy($request->validated());
        return ResponseProtocol::success(new TaxonomyResource($taxonomy), "Taxonomy created successfully.", 201);
    }

    // PUT/PATCH /taxonomies/{taxonomy}
    public function update(UpdateTaxonomyRequest $request, Taxonomy $taxonomy)
    {
        $updated = $this->service->updateTaxonomy($taxonomy, $request->validated());
        return ResponseProtocol::success(new TaxonomyResource($updated), "Taxonomy updated successfully.");
    }

    // DELETE /taxonomies/{taxonomy}
    public function destroy(Taxonomy $taxonomy)
    {
        $returnOfService = $this->service->deleteTaxonomy($taxonomy);
        if ($returnOfService) {
            return ResponseProtocol::success(null, "Taxonomy and its children deleted successfully.");
        } else {
            return ResponseProtocol::error("Failed to delete taxonomy.", 500);
        }
    }

    /**
     * -------------------------------------------------------------------------------------
     * @route GET /taxonomies/{taxonomy}/products
     * This endpoint retrieves all products associated with a specific taxonomy.
     * @Note This endpoint requires the user to be authenticated.
     * @Note This method not implemented yet.
     * -------------------------------------------------------------------------------------
     */
    public function products(Request $request, Taxonomy $taxonomy)
    {
        $with = (array) $request->query('with', []);
        $products = $this->service->getProductsByTaxonomy($taxonomy, $with);
        return ProductResource::collection($products);
    }
}
