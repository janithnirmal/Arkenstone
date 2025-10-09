<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Http\Requests\StoreTaxonomyRequest;
use Modules\Product\Http\Requests\UpdateTaxonomyRequest;
use Modules\Product\Models\Taxonomy;

class TaxonomyController extends Controller
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
     * Store a newly created resource in storage.
     */
    public function store(StoreTaxonomyRequest $request)
    {
        $taxonomy = $this->service->createTaxonomy($request->validated());
        return response()->json($taxonomy, 201);
    }

    /**
     * Show the specified resource.
     */
    public function show(Taxonomy $taxonomy)
    {
        return response()->json($taxonomy->load(['type','parent','children']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaxonomyRequest $request, Taxonomy $taxonomy)  
    {
        return response()->json($this->service->updateTaxonomy($taxonomy, $request->validated()));
    }
   

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Taxonomy $taxonomy)
    {
        $this->service->deleteTaxonomy($taxonomy);
        return response()->json(null, 204);
    }
}
