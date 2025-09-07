<?php

namespace Modules\Core\Contracts;

use Illuminate\Database\Eloquent\Relations\HasMany;

interface AttributeContract
{
    public function update(array $attributes = [], array $options = []);
    public function delete();

    /**
     * Get the values for the attribute.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\Modules\Product\Models\AttributeValue>
     */
    public function values(): HasMany;
}