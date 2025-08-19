<?php

namespace Modules\Product\Http\Controllers;

use App\Helpers\ResponseProtocol;
use App\Http\Controllers\Controller;

use Modules\Core\Contracts\ProductContract;
use Modules\Product\Events\ProductViewed;
use Modules\Product\Http\Resources\ProductResource;
use Modules\Product\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        // Use the resource to ensure consistent API responses
        return "Not Supported Web API calls";
    }

    public function show(ProductContract $product)
    {
        return "Not Supported Web API calls";
    }
}