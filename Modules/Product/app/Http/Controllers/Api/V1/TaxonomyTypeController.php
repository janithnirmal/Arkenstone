<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Helpers\ResponseProtocol;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Http\Requests\StoreTaxonomyTypeRequest;
use Modules\Product\Http\Requests\UpdateTaxonomyTypeRequest;
use Modules\Product\Models\TaxonomyType;
use Modules\Product\Http\Resources\TaxonomyTypeCollection;
use Modules\Product\Http\Resources\TaxonomyTypeResource;

/**
 * -------------------------------------------------------------------------------------
 * @group Taxonomy Types
 * APIs for managing taxonomy types (e.g., categories, tags)
 * 
 * A Taxonomy Type represents a classification type for products, such as categories or tags.
 * This controller provides endpoints to create, update, delete, and list taxonomy types.
 * 
 * @authenticated
 * 
 * @header Authorization Bearer {token}
 * 
 * @apiResourceCollection Modules\Product\Http\Resources\TaxonomyTypeCollection
 * @apiResourceModel Modules\Product\Models\TaxonomyType
 * -------------------------------------------------------------------------------------
 */
class TaxonomyTypeController extends Controller
{
     public function __construct(private TaxonomyManagerServiceInterface $service) {}

    // GET /taxonomy-types
    public function index(Request $request)
    {
        $types = $this->service->listTypes($request->all());
        return ResponseProtocol::success(new TaxonomyTypeCollection($types),"Taxonomy types retrieved successfully.");
    }

    // POST /taxonomy-types
    public function store(StoreTaxonomyTypeRequest $request)
    {
        $type = $this->service->createType($request->validated());
        return ResponseProtocol::success(new TaxonomyTypeResource($type), "Taxonomy type created successfully.");
    }

    // PUT/PATCH /taxonomy-types/{taxonomyType}
    public function update(UpdateTaxonomyTypeRequest $request, TaxonomyType $taxonomyType)
    {
        $updated = $this->service->updateType($taxonomyType, $request->validated());
        return ResponseProtocol::success(new TaxonomyTypeResource($updated), "Taxonomy type updated successfully.");
    }

    // DELETE /taxonomy-types/{taxonomyType}
    public function destroy(TaxonomyType $taxonomyType)
    {
        $this->service->deleteType($taxonomyType);
        return ResponseProtocol::success(null, "Taxonomy type deleted successfully.");

    }
}
