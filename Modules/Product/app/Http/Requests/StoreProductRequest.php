<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        return [
            'brand_id' => ['nullable', 'exists:brands,id'], // Check if brand exists
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'], // Must be less than price
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:1'], // e.g., 0.05 for 5%
            'stock' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],

            // For nested data like categories, images, variants (optional for MVP, but good to plan)
            'category_ids' => ['array'],
            'category_ids.*' => ['exists:categories,id'],

            'images' => ['array'],
            'images.*.url' => ['required_with:images', 'url', 'max:2048'],
            'images.*.alt_text' => ['nullable', 'string', 'max:255'],
            'images.*.is_primary' => ['boolean'],
            'images.*.order' => ['nullable', 'integer', 'min:0'],

            'variants' => ['array'],
            'variants.*.name' => ['required_with:variants', 'string', 'max:255'],
            'variants.*.sku' => ['required_with:variants', 'string', 'max:255', 'unique:product_variants,sku'],
            'variants.*.price' => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.discount_price' => ['nullable', 'numeric', 'min:0', 'lt:variants.*.price'],
            'variants.*.stock' => ['required_with:variants', 'integer', 'min:0'],
            'variants.*.is_active' => ['boolean'],
            'variants.*.attribute_value_ids' => ['required_with:variants.*.name', 'array'],
            'variants.*.attribute_value_ids.*' => ['exists:attribute_values,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'discount_price.lt' => 'The discount price must be less than the regular price.',
        ];
    }
}