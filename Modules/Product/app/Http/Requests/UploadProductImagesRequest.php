<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadProductImagesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'image', // Ensures the file is an image (e.g., jpg, png, bmp, gif, svg, or webp)
                'mimes:jpg,jpeg,png,gif,webp', // Explicitly define allowed extensions
                'max:2048', // Max file size in kilobytes (2MB)
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'images.required' => 'At least one image file is required.',
            'images.*.image' => 'Each file must be a valid image.',
            'images.*.mimes' => 'Only JPG, JPEG, PNG, GIF, and WebP images are allowed.',
            'images.*.max' => 'Each image may not be greater than 2MB.',
        ];
    }
}