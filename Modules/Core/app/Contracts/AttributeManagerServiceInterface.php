<?php

namespace Modules\Core\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface AttributeManagerServiceInterface
{
    public function getAllAttributes(): Collection;
    public function createAttribute(array $data): AttributeContract;
    public function updateAttribute(AttributeContract $attribute, array $data): AttributeContract;
    public function deleteAttribute(AttributeContract $attribute): bool;

    public function createAttributeValue(AttributeContract $attribute, array $data): AttributeValueContract;
    public function updateAttributeValue(AttributeValueContract $value, array $data): AttributeValueContract;
    public function deleteAttributeValue(AttributeValueContract $value): bool;
}