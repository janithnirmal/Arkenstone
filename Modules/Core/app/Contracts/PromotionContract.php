<?php

namespace Modules\Core\Contracts;

interface PromotionContract
{
    /**
     * Update the model in the database.
     */
    public function update(array $attributes = [], array $options = []);

    /**
     * Delete the model from the database.
     */
    public function delete();

    /**
     * Reload a fresh model instance from the database.
     */
    public function fresh($with = []);
}