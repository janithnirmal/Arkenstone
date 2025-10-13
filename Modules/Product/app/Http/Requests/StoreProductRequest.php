<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Product\Enum\DiscountType;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // For now, allow all. In a real app, you'd check user roles/permissions.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'brand_id' => 'nullable|exists:brands,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1024',
            'sku' => 'nullable|string|max:255|unique:products,sku',
            'price' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|in:' . implode(',', array_column(DiscountType::cases(), 'value')),
            'discount_value' => ['required', 'numeric'],
            'quantity' => 'nullable|integer|min:1',
            'is_active' => 'boolean',

            // For nested data like categories, images, variants (optional for MVP, but good to plan)
            'category_ids' => 'array',
            'category_ids.*' => 'exists:categories,id',

            'images' => 'array',
            'images.*.id' => 'required|integer|exists:product_images,id',
        ];

        if ($this->discount_type === DiscountType::PERCENTAGE->value) {
            $rules['discount_value'][] = 'min:0';
            $rules['discount_value'][] = 'max:100';
        } else {
            $rules['discount_value'][] = 'lt:price'; // must be less than price
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'discount_value.lt' => 'The discount value must be less than the regular value.',
        ];
    }
}