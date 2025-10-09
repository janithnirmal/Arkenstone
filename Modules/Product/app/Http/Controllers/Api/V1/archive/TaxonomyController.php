<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Http\Requests\StoreTaxonomyRequest;
use Modules\Product\Http\Requests\UpdateTaxonomyRequest;
use Modules\Product\Http\Resources\ProductResource;
use Modules\Product\Http\Resources\TaxonomyCollection;
use Modules\Product\Http\Resources\TaxonomyResource;
use Modules\Product\Models\Taxonomy;

class TaxonomyController extends Controller
{

public function __construct(private TaxonomyManagerServiceInterface $service) {}

    // GET /taxonomies
    public function index()
    {
        $taxonomies = $this->service->listTaxonomies(request()->all());
        return new TaxonomyCollection($taxonomies);
    }

    // POST /taxonomies
    public function store(StoreTaxonomyRequest $request)
    {
        $taxonomy = $this->service->createTaxonomy($request->validated());
        return (new TaxonomyResource($taxonomy))->response()->setStatusCode(201);
    }

    // GET /taxonomies/{taxonomy}
    public function show(Taxonomy $taxonomy)
    {
        $taxonomy->load(['type','parent','children']);
        return new TaxonomyResource($taxonomy);
    }

    // PUT/PATCH /taxonomies/{taxonomy}
    public function update(UpdateTaxonomyRequest $request, Taxonomy $taxonomy)
    {
        $updated = $this->service->updateTaxonomy($taxonomy, $request->validated());
        return new TaxonomyResource($updated);
    }

    // DELETE /taxonomies/{taxonomy}
    public function destroy(Taxonomy $taxonomy)
    {
        $this->service->deleteTaxonomy($taxonomy);
        return response()->noContent();
    }

    // GET /taxonomies/{taxonomy}/products
    public function products(Request $request, Taxonomy $taxonomy)
    {
        $with = (array) $request->query('with', []);
        $products = $this->service->getProductsByTaxonomy($taxonomy, $with);
        return ProductResource::collection($products);
    }
}
