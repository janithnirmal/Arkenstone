// resources/js/modules/products/services/productService.ts

import { apiDelete, apiGet, apiPost, apiPut } from '@@/core/lib/api';
import { toFormData } from '@@/core/lib/to-form-data';
import { Brand, Category, Product } from '../types';
import { CreateProductData, ProductListQuery, ProductListResponse, UpdateProductData } from '../types/http.types';

/**
 * Fetches a paginated list of products.
 * @param params - Query parameters for filtering, sorting, and pagination.
 * @returns A promise resolving to the paginated product list response.
 */
const getProducts = (params?: ProductListQuery): Promise<ProductListResponse> => {
    return apiGet('/products', { params });
};

/**
 * Fetches a single product by its ID.
 * @param id - The unique identifier of the product.
 * @returns A promise resolving to the detailed Product object.
 */
const getProduct = (id: number): Promise<Product> => {
    return apiGet(`/products/${id}`);
};

/**
 * Creates a new product. Handles multipart/form-data for image uploads.
 * @param productData - The data for the new product.
 * @returns A promise resolving to the newly created product.
 */
const createProduct = (productData: CreateProductData): Promise<Product> => {
    // The `toFormData` utility correctly handles file uploads and array data.
    const formData = toFormData(productData);

    return apiPost('/products', {
        data: formData,
        isMultipart: true, // Crucial for sending files
        displaySuccess: true, // Show a success toast message automatically
    });
};

/**
 * Updates an existing product by its ID.
 * @param id - The ID of the product to update.
 * @param productData - The data to update.
 * @returns A promise resolving to the updated product.
 */
const updateProduct = (id: number, productData: UpdateProductData): Promise<Product> => {
    // For updates, the API expects a PUT request.
    // We will assume for now it accepts JSON. If it requires multipart for image updates,
    // we would use the same `toFormData` and `apiPost` with `_method: 'PUT'` trick.
    return apiPut(`/products/${id}`, {
        data: productData,
        displaySuccess: true,
    });
};

/**
 * Deletes (archives) a product by its ID.
 * @param id - The ID of the product to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
const deleteProduct = (id: number): Promise<void> => {
    return apiDelete(`/products/${id}`, {
        displaySuccess: true,
    });
};

/**
 * Fetches a list of all categories.
 * @returns A promise resolving to an array of Category objects.
 */
const getCategories = (): Promise<Category[]> => {
    // Assuming the API returns a flat list under the 'data' key
    return apiGet('/categories');
};

/**
 * Fetches a paginated list of all brands.
 * @returns A promise resolving to an array of Brand objects.
 */
const getBrands = (): Promise<Brand[]> => {
    // Assuming the API returns a flat list under the 'data' key
    return apiGet('/brands');
};


// Bundle all functions into a single service object for easy importing.
export const productService = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getBrands,
};