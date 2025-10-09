<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Http\Requests\StoreTaxonomyTypeRequest;
use Modules\Product\Http\Requests\UpdateTaxonomyTypeRequest;
use Modules\Product\Models\TaxonomyType;
use Modules\Product\Http\Resources\TaxonomyTypeCollection;
use Modules\Product\Http\Resources\TaxonomyTypeResource;

class TaxonomyTypeController extends Controller
{
     public function __construct(private TaxonomyManagerServiceInterface $service) {}

    // GET /taxonomy-types
    public function index()
    {
        $types = $this->service->listTypes(request()->all());
        return new TaxonomyTypeCollection($types);
    }

    // POST /taxonomy-types
    public function store(StoreTaxonomyTypeRequest $request)
    {
        $type = $this->service->createType($request->validated());
        return (new TaxonomyTypeResource($type))->response()->setStatusCode(201);
    }

    // GET /taxonomy-types/{taxonomyType}
    public function show(TaxonomyType $taxonomyType)
    {
        $taxonomyType->load('taxonomies');
        return new TaxonomyTypeResource($taxonomyType);
    }

    // PUT/PATCH /taxonomy-types/{taxonomyType}
    public function update(UpdateTaxonomyTypeRequest $request, TaxonomyType $taxonomyType)
    {
        $updated = $this->service->updateType($taxonomyType, $request->validated());
        return new TaxonomyTypeResource($updated);
    }

    // DELETE /taxonomy-types/{taxonomyType}
    public function destroy(TaxonomyType $taxonomyType)
    {
        $this->service->deleteType($taxonomyType);
        return response()->noContent();
    }
}
