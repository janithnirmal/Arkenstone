<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePromotionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $type = $this->input('type', $this->route('promotion')->type);

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['sometimes', 'required', Rule::in(['product', 'category', 'brand', 'global'])],
            'entity_id' => ['sometimes', 'required_if:type,product,category,brand', 'nullable', 'integer'],
            'entity_id' => match ($type) {
                'product' => ['exists:products,id'],
                'category' => ['exists:categories,id'],
                'brand' => ['exists:brands,id'],
                default => [],
            },
            'discount_percent' => ['sometimes', 'required', 'numeric', 'between:0.01,100.00'],
            'discount_fixed' => ['nullable', 'numeric', 'min:0.01'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}