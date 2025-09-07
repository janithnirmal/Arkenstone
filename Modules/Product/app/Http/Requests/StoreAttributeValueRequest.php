<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Modules\Product\Models\Attribute;

class StoreAttributeValueRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // For now, allow all. Change this based on your user roles/permissions.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        // Get the attribute model instance from the route.
        /** @var Attribute $attribute */
        $attribute = $this->route('attribute');

        return [
            'value' => [
                'required',
                'string',
                'max:255',
                // The value must be unique for the given attribute_id.
                // e.g., "Color" can't have "Red" twice, but "Size" can have "Red".
                Rule::unique('attribute_values')->where(function ($query) use ($attribute) {
                    return $query->where('attribute_id', $attribute->id);
                }),
            ],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'value.unique' => 'This value already exists for this attribute.',
        ];
    }
}