<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Summary of UpdateTaxonomyRequest
 */
class UpdateTaxonomyRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'parent_id'=>[
                'nullable',
                'integer',
                'exists:taxonomies,id'
            ],
            'taxonomy_type_id'=>'sometimes|required|integer|exists:taxonomy_types,id',
            'name'=>'sometimes|required|string|max:255',
            'slug'=>'sometimes|required|string|max:255',
            'description'=>'nullable|string',
            'sort_order'=>'nullable|integer|min:0',
            'meta'=>'nullable|array'
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
