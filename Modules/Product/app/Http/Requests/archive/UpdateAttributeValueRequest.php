<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Modules\Product\Models\AttributeValue;

class UpdateAttributeValueRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
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
        // Get the attribute value model instance from the route.
        /** @var AttributeValue $attributeValue */
        $attributeValue = $this->route('attribute_value');

        return [
            'value' => [
                'sometimes', // 'sometimes' means only validate if the field is present.
                'required',
                'string',
                'max:255',
                Rule::unique('attribute_values')
                    // Check for uniqueness on the same attribute.
                    ->where('attribute_id', $attributeValue->attribute_id)
                    // Ignore the current attribute value's ID during the check.
                    ->ignore($attributeValue->id),
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