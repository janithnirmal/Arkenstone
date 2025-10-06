<?php

namespace Modules\Product\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Modules\Core\Contracts\AttributeManagerServiceInterface;
use Modules\Product\Http\Requests\StoreAttributeRequest;
use Modules\Product\Http\Requests\StoreAttributeValueRequest;
use Modules\Product\Http\Requests\UpdateAttributeRequest;
use Modules\Product\Http\Requests\UpdateAttributeValueRequest;
use Modules\Product\Http\Resources\AttributeResource;
use Modules\Product\Http\Resources\AttributeValueResource;
use Modules\Product\Models\Attribute;
use Modules\Product\Models\AttributeValue;

class AttributeController extends Controller
{
    /**
     * The service instance for managing attributes.
     */
    protected AttributeManagerServiceInterface $attributeService;

    /**
     * Inject the service dependency.
     */
    public function __construct(AttributeManagerServiceInterface $attributeService)
    {
        $this->attributeService = $attributeService;
    }

    /**
     * Display a listing of all attributes and their values.
     */
    public function index(): JsonResource
    {
        $attributes = $this->attributeService->getAllAttributes();
        return AttributeResource::collection($attributes);
    }

    /**
     * Store a newly created attribute (e.g., "Color", "Size").
     */
    public function store(StoreAttributeRequest $request): JsonResponse
    {
        $attribute = $this->attributeService->createAttribute($request->validated());
        return (new AttributeResource($attribute))->response()->setStatusCode(201);
    }

    /**
     * Update an existing attribute.
     */
    public function update(UpdateAttributeRequest $request, Attribute $attribute): AttributeResource
    {
        $updatedAttribute = $this->attributeService->updateAttribute($attribute, $request->validated());
        return new AttributeResource($updatedAttribute);
    }

    /**
     * Remove the specified attribute from storage.
     */
    public function destroy(Attribute $attribute): JsonResponse
    {
        try {
            $this->attributeService->deleteAttribute($attribute);
            return response()->json(null, 204);
        } catch (ValidationException $e) {
            // Return a 409 Conflict status code if the service's business rule fails.
            return response()->json(['message' => $e->getMessage()], 409);
        }
    }

    /**
     * Store a new value for a specific attribute (e.g., add "Red" to "Color").
     */
    public function storeValue(StoreAttributeValueRequest $request, Attribute $attribute): JsonResponse
    {
        $value = $this->attributeService->createAttributeValue($attribute, $request->validated());
        return (new AttributeValueResource($value))->response()->setStatusCode(201);
    }

    /**
     * Update an existing attribute value.
     */
    public function updateValue(UpdateAttributeValueRequest $request, AttributeValue $attribute_value): AttributeValueResource
    {
        $value = $this->attributeService->updateAttributeValue($attribute_value, $request->validated());
        return new AttributeValueResource($value);
    }

    /**
     * Remove the specified attribute value from storage.
     */
    public function destroyValue(AttributeValue $attribute_value): JsonResponse
    {
        try {
            $this->attributeService->deleteAttributeValue($attribute_value);
            return response()->json(null, 204);
        } catch (ValidationException $e) {
            // Return a 409 Conflict status code if the service's business rule fails.
            return response()->json(['message' => $e->getMessage()], 409);
        }
    }
}