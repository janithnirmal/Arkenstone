<?php

namespace Modules\Product\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;
use Modules\Core\Contracts\AttributeContract;
use Modules\Core\Contracts\AttributeManagerServiceInterface;
use Modules\Core\Contracts\AttributeValueContract;
use Modules\Product\Models\Attribute;
use Modules\Product\Models\AttributeValue;

class AttributeManagerService implements AttributeManagerServiceInterface
{
    public function getAllAttributes(): Collection
    {
        return Attribute::with('values')->get();
    }

    public function createAttribute(array $data): AttributeContract
    {
        // Fire event: AttributeCreated
        return Attribute::create($data);
    }

    public function updateAttribute(AttributeContract $attribute, array $data): AttributeContract
    {
        $attribute->update($data);
        // Fire event: AttributeUpdated
        return $attribute;
    }

    public function deleteAttribute(AttributeContract $attribute): bool
    {
        // Business Rule: Don't delete an attribute if its values are in use.
        if (AttributeValue::where('attribute_id', $attribute->id)->has('productVariants')->exists()) {
            throw ValidationException::withMessages([
                'attribute' => 'Cannot delete. One or more of its values are in use by product variants.'
            ]);
        }
        // Fire event: AttributeDeleted
        return $attribute->delete();
    }

    public function createAttributeValue(AttributeContract $attribute, array $data): AttributeValueContract
    {
        $value = $attribute->values()->create($data);
        // Fire event: AttributeValueCreated
        return $value;
    }

    public function updateAttributeValue(AttributeValueContract $value, array $data): AttributeValueContract
    {
        $value->update($data);
        // Fire event: AttributeValueUpdated
        return $value;
    }

    public function deleteAttributeValue(AttributeValueContract $value): bool
    {
        // Business Rule: Don't delete a value if it is in use.
        if ($value->productVariants()->exists()) {
            throw ValidationException::withMessages([
                'value' => 'Cannot delete value. It is in use by one or more product variants.'
            ]);
        }
        // Fire event: AttributeValueDeleted
        return $value->delete();
    }
}