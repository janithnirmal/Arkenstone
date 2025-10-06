<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePromotionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $type = $this->input('type');

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::in(['product', 'category', 'brand', 'global'])],

            // entity_id is required if the type is not 'global'
            'entity_id' => ['required_if:type,product,category,brand', 'nullable', 'integer'],

            // Conditionally check for existence based on the selected type
            'entity_id' => match ($type) {
                'product' => ['exists:products,id'],
                'category' => ['exists:categories,id'],
                'brand' => ['exists:brands,id'],
                default => [],
            },

            'discount_percent' => ['required', 'numeric', 'between:0.01,100.00'],
            'discount_fixed' => ['nullable', 'numeric', 'min:0.01'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->input('type') === 'global') {
            $this->merge(['entity_id' => null]);
        }
    }
}