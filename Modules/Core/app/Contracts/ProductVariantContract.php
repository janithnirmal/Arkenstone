<?php

namespace Modules\Core\Contracts;

interface ProductVariantContract
{
    public function update(array $attributes = [], array $options = []);
    public function delete();
}