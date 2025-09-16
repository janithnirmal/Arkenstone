// resources/js/modules/products/services/brandService.ts

import { apiDelete, apiGet, apiPost } from '@@/core/lib/api';
import { toFormData } from '@@/core/lib/to-form-data';
import { Brand } from '../types';
import { PaginatedResponse } from '../types/http.types';

/**
 * Defines the shape of the data for creating or updating a brand.
 * Logo can be a File object for new uploads, or undefined if not changing.
 */
export interface BrandFormData {
    name: string;
    slug?: string;
    logo?: File | null;
}

/**
 *react-hook-form will give FileList for the logo field.
 */
export interface BrandFormShape {
    name: string;
    logo?: FileList;
}

/**
 * Fetches a paginated list of all brands.
 * Note: Your API docs mention this is paginated.
 * @returns A promise resolving to a paginated response of Brand objects.
 */
const getBrands = (): Promise<PaginatedResponse<Brand>> => {
    return apiGet('/brands');
};

/**
 * Creates a new brand, potentially with a logo upload.
 * @param data - The data for the new brand.
 * @returns A promise resolving to the newly created brand.
 */
const createBrand = (data: BrandFormData): Promise<Brand> => {
    const formData = toFormData(data);
    return apiPost('/brands', {
        data: formData,
        isMultipart: true,
        displaySuccess: true,
    });
};

/**
 * Updates an existing brand by its ID.
 * Laravel/PHP requires using POST with a _method field for multipart updates.
 * @param id - The ID of the brand to update.
 * @param data - The data to update.
 * @returns A promise resolving to the updated brand.
 */
const updateBrand = (id: number, data: BrandFormData): Promise<Brand> => {
    const formData = toFormData(data);
    formData.append('_method', 'PUT'); // Spoof PUT request for multipart

    return apiPost(`/brands/${id}`, {
        data: formData,
        isMultipart: true,
        displaySuccess: true,
    });
};

/**
 * Deletes a brand by its ID.
 * @param id - The ID of the brand to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
const deleteBrand = (id: number): Promise<void> => {
    return apiDelete(`/brands/${id}`, { displaySuccess: true });
};

export const brandService = {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
};