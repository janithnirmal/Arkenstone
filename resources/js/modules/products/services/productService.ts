// resources/js/modules/products/services/productService.ts

import { apiDelete, apiGet, apiPost, apiPut } from '@@/core/lib/api';
import { toFormData } from '@@/core/lib/to-form-data';
import { Brand, Category, Product, ProductVariant, ProductImage } from '../types';
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

export interface VariantFormData {
    name: string;
    sku: string;
    price: number;
    stock: number;
    // You will likely need to send the attribute values that make up this variant
    // For simplicity, we assume the name "Red / Large" is enough for the backend to parse
}

/**
 * Creates a new variant for a specific product.
 * @param productId The ID of the product.
 * @param variantData The data for the new variant.
 * @returns The newly created variant.
 */
const createVariant = (productId: number, variantData: VariantFormData): Promise<ProductVariant> => {
    return apiPost(`/products/${productId}/variants`, { data: variantData, displaySuccess: true });
};

/**
 * Updates an existing product variant.
 * @param variantId The ID of the variant to update.
 * @param variantData The data to update.
 * @returns The updated variant.
 */
const updateVariant = (variantId: number, variantData: Partial<VariantFormData>): Promise<ProductVariant> => {
    // Note: The API docs show PUT /products/variants/{variant_id}, not nested under product
    return apiPut(`/products/variants/${variantId}`, { data: variantData, displaySuccess: true });
};

/**
 * Deletes a product variant.
 * @param variantId The ID of the variant to delete.
 */
const deleteVariant = (variantId: number): Promise<void> => {
    return apiDelete(`/products/variants/${variantId}`, { displaySuccess: true });
};

/**
 * Uploads one or more images for a specific product.
 * @param productId The ID of the product.
 * @param images An array of File objects to upload.
 * @returns A promise that resolves with the data of the newly created images.
 */
const uploadProductImages = (productId: number, images: File[]): Promise<ProductImage[]> => {
    // Our toFormData utility correctly handles array data with the `[]` syntax.
    const formData = toFormData({ images });

    return apiPost(`/products/${productId}/images`, {
        data: formData,
        isMultipart: true, // This is essential for file uploads
        displaySuccess: true,
    });
};

/**
 * Deletes a specific product image.
 * The API endpoint is based on the product_image_id, not the product_id.
 * @param imageId The ID of the product_image record to delete.
 * @returns A promise that resolves when deletion is complete.
 */
const deleteProductImage = (imageId: number): Promise<void> => {
    return apiDelete(`/products/images/${imageId}`, {
        displaySuccess: true,
    });
};

/**
 * Updates the stock for a simple product (one without variants).
 * @param productId The ID of the product.
 * @param stock The new stock quantity.
 * @returns A promise that resolves with the updated product data.
 */
const updateProductStock = (productId: number, stock: number): Promise<Product> => {
    // Laravel's PATCH method is used here, but api utility can handle it via apiPut/apiPost.
    // Assuming apiPut can handle PATCH or have an apiPatch. We'll use apiPut for now.
    // The API docs specify PATCH, but often PUT can be used if the backend route accepts it.
    // If not, might need an `apiPatch` function in core `api.ts`. Let's assume apiPost with method spoofing.
    const formData = new FormData();
    formData.append('stock', stock.toString());
    formData.append('_method', 'PATCH');

    return apiPost(`/products/${productId}/stock`, {
        data: formData,
        isMultipart: true, // Use multipart to send form-data
        displaySuccess: true,
    });
};


/**
 * Updates the stock for a specific product variant.
 * @param variantId The ID of the variant.
 * @param stock The new stock quantity.
 * @returns A promise that resolves with the updated variant data.
 */
const updateVariantStock = (variantId: number, stock: number): Promise<ProductVariant> => {
    const formData = new FormData();
    formData.append('stock', stock.toString());
    formData.append('_method', 'PATCH');

    return apiPost(`/products/variants/${variantId}/stock`, {
        data: formData,
        isMultipart: true,
        displaySuccess: true,
    });
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
    createVariant,
    updateVariant,
    deleteVariant,
    uploadProductImages,
    deleteProductImage,
    updateProductStock,
    updateVariantStock,
};