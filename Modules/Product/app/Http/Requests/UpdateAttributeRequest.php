<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAttributeRequest extends FormRequest
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
        // Get the ID of the attribute being updated from the route parameter.
        $attributeId = $this->route('attribute')->id;

        return [
            'name' => [
                'sometimes', // Only validate this rule if 'name' is present in the request data.
                'required',
                'string',
                'max:255',
                Rule::unique('attributes', 'name')->ignore($attributeId),
            ],
        ];
    }
}