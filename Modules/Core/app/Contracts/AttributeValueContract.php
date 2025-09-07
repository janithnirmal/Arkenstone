<?php

namespace Modules\Core\Contracts;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

interface AttributeValueContract
{
    public function update(array $attributes = [], array $options = []);
    public function delete();

    /**
     * Get the product variants that use this attribute value.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function productVariants(): BelongsToMany;
}