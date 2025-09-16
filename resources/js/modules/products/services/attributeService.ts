// resources/js/modules/products/services/attributeService.ts

import { apiGet, apiPost } from '@@/core/lib/api';
import { Attribute } from '../types';

/**
 * Fetches all global attributes and their possible values.
 * @returns A promise resolving to an array of Attribute objects.
 */
const getAttributes = (): Promise<Attribute[]> => {
    return apiGet('/attributes');
};

/**
 * Creates a new global attribute (e.g., "Color", "Size").
 * @param name - The name of the new attribute.
 * @returns A promise resolving to the newly created attribute.
 */
const createAttribute = (name: string): Promise<Attribute> => {
    return apiPost('/attributes', { data: { name }, displaySuccess: true });
};

/**
 * Adds a new value to an existing attribute.
 * @param attributeId - The ID of the attribute to add a value to.
 * @param value - The new value to add (e.g., "Red", "Large").
 * @returns A promise resolving to the newly created attribute value.
 */
const createAttributeValue = (attributeId: number, value: string) => {
    return apiPost(`/attributes/${attributeId}/values`, { data: { value }, displaySuccess: true });
};

export const attributeService = {
    getAttributes,
    createAttribute,
    createAttributeValue,
};