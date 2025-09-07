<?php

namespace Modules\Core\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PromotionManagerServiceInterface
{
    public function findPromotion(int $id): ?PromotionContract;
    public function queryPromotions(array $filters): LengthAwarePaginator;
    public function createPromotion(array $data): PromotionContract;
    public function updatePromotion(PromotionContract $promotion, array $data): PromotionContract;
    public function deletePromotion(PromotionContract $promotion): bool;
}