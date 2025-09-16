// resources/js/modules/products/services/categoryService.ts

import { apiDelete, apiGet, apiPost, apiPut } from '@@/core/lib/api';
import { Category } from '../types';

/**
 * Defines the shape of the data for creating or updating a category.
 */
export interface CategoryFormData {
    name: string;
    parent_id?: number | null;
}

/**
 * Fetches the nested tree of all product categories.
 * @returns A promise resolving to an array of top-level Category objects, each with potential children.
 */
const getCategories = (): Promise<Category[]> => {
    return apiGet('/categories');
};

/**
 * Creates a new category.
 * @param data - The data for the new category (name and optional parent_id).
 * @returns A promise resolving to the newly created category.
 */
const createCategory = (data: CategoryFormData): Promise<Category> => {
    return apiPost('/categories', { data, displaySuccess: true });
};

/**
 * Updates an existing category by its ID.
 * @param id - The ID of the category to update.
 * @param data - The data to update.
 * @returns A promise resolving to the updated category.
 */
const updateCategory = (id: number, data: CategoryFormData): Promise<Category> => {
    return apiPut(`/categories/${id}`, { data, displaySuccess: true });
};

/**
 * Deletes a category by its ID.
 * @param id - The ID of the category to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
const deleteCategory = (id: number): Promise<void> => {
    return apiDelete(`/categories/${id}`, { displaySuccess: true });
};


export const categoryService = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};