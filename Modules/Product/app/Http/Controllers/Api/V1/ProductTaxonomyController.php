<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use App\Helpers\ResponseProtocol;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Core\Contracts\TaxonomyManagerServiceInterface;
use Modules\Product\Http\Requests\AttachTaxonomiesToProductRequest;
use Modules\Product\Http\Requests\SyncProductTaxonomyRequest;
use Modules\Product\Http\Resources\TaxonomyResource;
use Modules\Product\Models\Product;
use Modules\Product\Models\Taxonomy;


class ProductTaxonomyController extends Controller
{

    public function __construct(private TaxonomyManagerServiceInterface $service)
    {
    }

    // GET /products/{product}/taxonomies
    public function index(Request $request, Product $product)
    {
        $typeId = $request->query('type_id');
        $taxonomies = $this->service->getProductTaxonomies($product, $typeId); // expect Collection
        return TaxonomyResource::collection($taxonomies);
    }

    // The attach method needs the product from the URL
    public function attach(AttachTaxonomiesToProductRequest $request, Product $product)
    {
        $this->service->attachToProduct($product, $request->validated()['taxonomy_ids']);
        return ResponseProtocol::success(null, 'Taxonomies attached to product successfully.');
    }

    // The sync method needs the product from the URL
    public function sync(SyncProductTaxonomyRequest $request, Product $product)
    {
        $this->service->syncForProduct($product, $request->validated()['taxonomy_ids']);
        return ResponseProtocol::success(null, 'Product taxonomies synced successfully.');
    }

    // The detach method now gets both the product and the taxonomy to detach
    public function detach(Product $product, Taxonomy $taxonomy)
    {
        $this->service->detachFromProduct($product, $taxonomy);
        return ResponseProtocol::success(null, 'Taxonomy detached from product successfully.');
    }

}
