<?php

namespace Modules\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'name'=>'sometimes|required|string|max:255',
            'slug'=>'sometimes|required|string|max:255',
            'description'=>'nullable|string',
            'sort_order'=>'nullable|integer|min:0',
            'metadata'=>'nullable|array'
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
