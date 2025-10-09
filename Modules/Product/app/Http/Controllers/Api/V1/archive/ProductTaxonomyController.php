<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Http\Requests\AttachTaxonomiesToProductRequest;
use Modules\Product\Http\Resources\TaxonomyResource;
use Modules\Product\Models\Product;
use Modules\Product\Models\Taxonomy;


class ProductTaxonomyController extends Controller
{

 public function __construct(private TaxonomyManagerServiceInterface $service) {}

    // GET /products/{product}/taxonomies
    public function index(Request $request, Product $product)
    {
        $typeId = $request->query('type_id');
        $taxonomies = $this->service->getProductTaxonomies($product, $typeId); // expect Collection
        return TaxonomyResource::collection($taxonomies);
    }

    // POST /products/{product}/taxonomies/attach
    public function attach(AttachTaxonomiesToProductRequest $request, Product $product)
    {
        $this->service->attachToProduct($product, $request->validated()['taxonomy_ids']);
        return response()->noContent();
    }

    // PUT /products/{product}/taxonomies/sync
    public function sync(AttachTaxonomiesToProductRequest $request, Product $product)
    {
        $this->service->syncForProduct($product, $request->validated()['taxonomy_ids']);
        return response()->noContent();
    }

    // DELETE /products/{product}/taxonomies/{taxonomy}
    public function detach(Product $product, Taxonomy $taxonomy)
    {
        $this->service->detachFromProduct($product, $taxonomy->id);
        return response()->noContent();
    }

}
