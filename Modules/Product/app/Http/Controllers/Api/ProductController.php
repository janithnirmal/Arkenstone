<?php

namespace Modules\Product\Http\Controllers\Api;

use App\Helpers\ResponseProtocol;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Product\App\Http\Requests\QueryProductRequest;
use Modules\Product\App\Http\Requests\StoreProductRequest;
use Modules\Product\Contracts\ProductManagerServiceInterface;
use Modules\Product\Http\Resources\ProductResource;

class ProductController extends Controller
{

    public function __construct(protected ProductManagerServiceInterface $productManagerService)
    {

    }

    /**
     * Display a listing of the resource.
     */
    public function index(QueryProductRequest $requst)
    {
        if ($requst->has("id")) {
            return ResponseProtocol::success($this->productManagerService->find($requst->validated("id")));
        }

        // return ResponseProtocol::success($this->productManagerService->queryProducts($requst->validated()));
        return ResponseProtocol::success(ProductResource::collection($this->productManagerService->queryProducts($requst->validated())));
    }


    public function store(StoreProductRequest $request)
    {
        return ResponseProtocol::success($this->productManagerService->createProduct($request->validated()));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //

        return response()->json([]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //

        return response()->json([]);
    }
}
