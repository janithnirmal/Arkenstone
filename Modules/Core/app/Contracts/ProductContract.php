<?php

namespace Modules\Core\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface ProductContract
{
    public function getId(): int;
    public function getName(): string;
    public function getPrice(): float;
    public function getImageUrl(): ?string; // Now represents the primary image URL
    public function isInStock(): bool;

    /**
     * Gets all categories associated with the product.
     * @return Collection
     */
    public function getCategories();

    /**
     * Gets all terms (from all taxonomies) associated with the product.
     * @return Collection
     */
    public function getTerms();
}