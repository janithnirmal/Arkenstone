<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Http\Requests\StoreTaxonomyTypeRequest;
use Modules\Product\Http\Requests\UpdateTaxonomyTypeRequest;
use Modules\Product\Models\TaxonomyType;

class TaxonomyTypeController extends Controller
{
    public function __construct(private TaxonomyManagerServiceInterface $service)
    {
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json($this->service->listTypes(request()->all()));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaxonomyTypeRequest $request)
    {
        return response()->json($this->service->createType($request->validated()), 201);
    }

    /**
     * Show the specified resource.
     */
    public function show(TaxonomyType $taxonomyType)
    {
        return response()->json($taxonomyType->load('taxonomies'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaxonomyTypeRequest $request, TaxonomyType $taxonomyType)
    {
        return response()->json($this->service->updateType($taxonomyType, $request->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaxonomyType $taxonomyType)
    {
        $this->service->deleteType($taxonomyType);

        return response()->json(null, 204);
    }
}
