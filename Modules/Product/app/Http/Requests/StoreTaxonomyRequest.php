<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaxonomyRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'taxonomy_type_id' => 'required|exists:taxonomy_types,id',
            'parent_id' => [
                'nullable',
                'integer',
                'exists:taxonomies,id'
            ],
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('taxonomies', 'slug')->where(fn($q) => $q->where('taxonomy_type_id', $this->taxonomy_type_id))
            ],
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'meta' => 'nullable|array'
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
