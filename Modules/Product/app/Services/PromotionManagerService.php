<?php

namespace Modules\Product\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Modules\Core\Contracts\PromotionContract;
use Modules\Core\Contracts\PromotionManagerServiceInterface;
use Modules\Product\Events\PromotionCreated;
use Modules\Product\Events\PromotionDeleted;
use Modules\Product\Events\PromotionUpdated;
use Modules\Product\Models\Promotion;
use Modules\Product\Models\Product;
use Modules\Product\Models\Category;
use Modules\Product\Models\Brand;

class PromotionManagerService implements PromotionManagerServiceInterface
{
    public function findPromotion(int $id): ?PromotionContract
    {
        return Promotion::find($id);
    }

    public function queryPromotions(array $filters): LengthAwarePaginator
    {
        $query = Promotion::query();

        // Filter by active status
        $query->when(isset($filters['is_active']), function ($q) use ($filters) {
            $q->where('is_active', (bool)$filters['is_active']);
        });

        // Filter by promotion type
        $query->when(isset($filters['type']), function ($q) use ($filters) {
            $q->where('type', $filters['type']);
        });

        return $query->latest()->paginate($filters['limit'] ?? 15);
    }

    public function createPromotion(array $data): PromotionContract
    {
        $promotion = Promotion::create($data);
        PromotionCreated::dispatch($promotion);
        return $promotion;
    }

    public function updatePromotion(PromotionContract|Promotion $promotion, array $data): PromotionContract
    {
        $promotion->update($data);
        $updatedPromotion = $promotion->fresh();
        PromotionUpdated::dispatch($updatedPromotion);
        return $updatedPromotion;
    }

    public function deletePromotion(PromotionContract|Promotion $promotion): bool
    {
        $result = $promotion->delete();
        if ($result) {
            PromotionDeleted::dispatch($promotion);
        }
        return $result;
    }
}