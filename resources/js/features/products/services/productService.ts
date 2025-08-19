import { apiDelete, apiGet, apiPost } from '@/core/lib/api';
import { toFormData } from '@/core/lib/to-form-data';

import { Product } from '../types';
import { CatalogResult, CreateProductData, ProductQuery, UpdateProductData } from '../types/http.types';

/**
 * Fetches a paginated list of products, with optional filtering and sorting.
 * @param params - The query parameters for filtering and pagination.
 * @returns A promise that resolves to the paginated CatalogResult.
 */
const getProducts = async (params?: ProductQuery): Promise<CatalogResult> => {
    // For a GET request, the api utility correctly places 'params' into the URL query string.
    // We expect the raw paginated response from Laravel.
    return apiGet('/products', { params });
};

/**
 * Fetches a single product by its ID.
 * @param id - The ID of the product to fetch.
 * @returns A promise that resolves to the Product object.
 */
const getProductById = async (id: number | string): Promise<Product> => {
    // The api utility handles extracting the nested 'data' object for single resources.
    return apiGet(`/products`, {
        data: {
            id,
        },
    });
};

/**
 * Creates a new product. Handles multipart form data for image uploads.
 * @param data - The data for the new product, including optional image files.
 * @returns A promise that resolves to the newly created Product object.
 */
const createProduct = async (data: CreateProductData): Promise<Product> => {
    const formData = toFormData(data);

    return apiPost('/products', {
        data: formData,
        isMultipart: true, // This is crucial for file uploads
        displaySuccess: true, // Display a success toast on completion
    });
};

/**
 * Updates an existing product. Handles multipart form data for new images.
 * @param id - The ID of the product to update.
 * @param data - The data to update.
 * @returns A promise that resolves to the updated Product object.
 */
const updateProduct = async (id: number | string, data: UpdateProductData): Promise<Product> => {
    const formData = toFormData(data);
    // For multipart form updates in Laravel, we use a POST request
    // and add a `_method` field with the value 'PUT'.
    formData.append('_method', 'PUT');

    return apiPost(`/products/${id}`, {
        data: formData,
        isMultipart: true,
        displaySuccess: true,
    });
};

/**
 * Deletes a product by its ID.
 * @param id - The ID of the product to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
const deleteProduct = async (id: number | string): Promise<void> => {
    // The API returns a 204 No Content, and the api utility will resolve with no data.
    await apiDelete(`/products/${id}`, { displaySuccess: true });
};

export const productService = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
