<?php

namespace Modules\Core\Contracts;

/**
 * Interface CategoryContract
 * Represents a category entity.
 */
interface CategoryContract
{
    /**
     * Update the model in the database.
     *
     * @param array $attributes
     * @param array $options
     * @return bool
     */
    public function update(array $attributes = [], array $options = []);

    /**
     * Delete the model from the database.
     *
     * @return bool|null
     */
    public function delete();

    /**
     * Reload a fresh model instance from the database.
     *
     * @param  array|string|null  $with
     * @return static|null
     */
    public function fresh($with = []);
}