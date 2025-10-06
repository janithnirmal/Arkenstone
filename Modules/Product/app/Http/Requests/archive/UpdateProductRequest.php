<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
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
        // Get the product ID from the route for unique checks
        $productId = $this->route('product'); // 'product' is the route parameter name

        return [
            'brand_id' => ['nullable', 'exists:brands,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sku' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('products', 'sku')->ignore($productId)],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'is_active' => ['boolean'],

            'category_ids' => ['array'],
            'category_ids.*' => ['exists:categories,id'],

            'images' => ['array'], // Existing images may also be updated/deleted, new ones added
            'images.*.id' => ['nullable', 'exists:product_images,id'], // ID for existing images
            'images.*.url' => ['required_with:images.*.id,images.*.alt_text', 'url', 'max:2048'],
            'images.*.alt_text' => ['nullable', 'string', 'max:255'],
            'images.*.is_primary' => ['boolean'],
            'images.*.order' => ['nullable', 'integer', 'min:0'],

            'variants' => ['array'], // Existing variants may be updated/deleted, new ones added
            'variants.*.id' => ['nullable', 'exists:product_variants,id'], // ID for existing variants
            'variants.*.name' => ['required_with:variants.*.id', 'string', 'max:255'],
            'variants.*.sku' => [
                'required_with:variants.*.id',
                'string',
                'max:255',
                Rule::unique('product_variants', 'sku')->ignore($this->input('variants.*.id')) // Needs careful handling for array unique rule
            ],
            'variants.*.price' => ['required_with:variants.*.id', 'numeric', 'min:0'],
            'variants.*.discount_price' => ['nullable', 'numeric', 'min:0', 'lt:variants.*.price'],
            'variants.*.stock' => ['required_with:variants.*.id', 'integer', 'min:0'],
            'variants.*.is_active' => ['boolean'],
            'variants.*.attribute_value_ids' => ['required_with:variants.*.name', 'array'],
            'variants.*.attribute_value_ids.*' => ['exists:attribute_values,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'discount_price.lt' => 'The discount price must be less than the regular price.',
            'variants.*.discount_price.lt' => 'The variant discount price must be less than its regular price.',
        ];
    }
}