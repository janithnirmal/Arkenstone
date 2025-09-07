<?php

namespace Modules\Product\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Core\Contracts\CategoryContract;

class CategoryUpdated
{
    use Dispatchable, SerializesModels;

    public CategoryContract $category;

    /**
     * Create a new event instance.
     */
    public function __construct(CategoryContract $category)
    {
        $this->category = $category;
        Log::info("Category Updated Event: A category was updated.", ['id' => $category->id, 'name' => $category->name]);
    }
}