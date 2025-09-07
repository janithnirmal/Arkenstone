<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Modules\Core\Contracts\PromotionManagerServiceInterface;
use Modules\Product\Http\Requests\StorePromotionRequest;
use Modules\Product\Http\Requests\UpdatePromotionRequest;
use Modules\Product\Http\Resources\PromotionResource;
use Modules\Product\Models\Promotion;

class PromotionController extends Controller
{
    protected PromotionManagerServiceInterface $promotionService;

    public function __construct(PromotionManagerServiceInterface $promotionService)
    {
        $this->promotionService = $promotionService;
    }

    public function index(Request $request): JsonResource
    {
        $promotions = $this->promotionService->queryPromotions($request->all());
        return PromotionResource::collection($promotions);
    }

    public function store(StorePromotionRequest $request): JsonResponse
    {
        $promotion = $this->promotionService->createPromotion($request->validated());
        return (new PromotionResource($promotion))->response()->setStatusCode(201);
    }

    public function show(Promotion $promotion): PromotionResource
    {
        return new PromotionResource($promotion);
    }

    public function update(UpdatePromotionRequest $request, Promotion $promotion): PromotionResource
    {
        $updatedPromotion = $this->promotionService->updatePromotion($promotion, $request->validated());
        return new PromotionResource($updatedPromotion);
    }

    public function destroy(Promotion $promotion): JsonResponse
    {
        $this->promotionService->deletePromotion($promotion);
        return response()->json(null, 204);
    }
}