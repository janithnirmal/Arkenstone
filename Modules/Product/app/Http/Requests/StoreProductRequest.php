<?php

namespace Modules\Product\App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * In a real application, this would check for permissions, e.g., Auth::user()->can('create-products').
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * These rules are designed for creating a new product and handle the full complexity
     * of the enhanced product model, including relationships and file uploads.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            // --- Core Product Details ---
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',

            // --- Relationships (Optional on creation) ---
            // 'categories' must be an array if it is present.
            'categories' => 'sometimes|array',
            // Each item within the 'categories' array must be an integer and exist in the 'categories' table.
            'categories.*' => 'integer|exists:categories,id',

            // 'terms' must be an array if it is present.
            'terms' => 'sometimes|array',
            // Each item within the 'terms' array must be an integer and exist in the 'terms' table.
            'terms.*' => 'integer|exists:terms,id',

            // --- File Uploads (Optional on creation) ---
            // 'images' must be an array if it is present.
            'images' => 'sometimes|array',
            // Each item in the 'images' array must be a valid image file.
            // We restrict the mimetypes and set a maximum file size (e.g., 2MB).
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.unique' => 'A product with this name already exists.',
            'categories.*.exists' => 'One or more of the selected categories are invalid.',
            'terms.*.exists' => 'One or more of the selected taxonomies are invalid.',
            'images.*.image' => 'One or more of the uploaded files is not a valid image.',
            'images.*.max' => 'An uploaded image cannot be larger than 2MB.',
        ];
    }
}