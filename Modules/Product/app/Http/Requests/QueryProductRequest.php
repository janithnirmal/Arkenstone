<?php

namespace Modules\Product\App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QueryProductRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => 'sometimes|integer|exists:products,id',

            'categories' => 'sometimes|array',
            'categories.*' => 'integer|exists:categories,id',

            'min_price' => 'sometimes|numeric|min:0',
            'max_price' => 'sometimes|numeric|gt:min_price',

            'sort_by' => ['sometimes', 'string', Rule::in(['price_asc', 'price_desc', 'name_asc', 'name_desc'])],

            'per_page' => 'sometimes|integer|min:1|max:100',
        ];
    }
}