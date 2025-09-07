<?php

namespace Modules\Product\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionResource extends JsonResource
{
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'entity_id' => $this->entity_id,
            'discount_percent' => (float)$this->discount_percent,
            'discount_fixed' => (float)$this->discount_fixed,
            'start_date' => $this->start_date?->toIso8601String(),
            'end_date' => $this->end_date?->toIso8601String(),
            'is_active' => (bool)$this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),

            // This whenLoaded() check will only include the entity if it was successfully loaded by the service.
            'entity' => $this->whenLoaded('entity', function () {
                if (!$this->entity) return null;
                return [
                    'id' => $this->entity->id,
                    'name' => $this->entity->name,
                ];
            }),
        ];
    }
}