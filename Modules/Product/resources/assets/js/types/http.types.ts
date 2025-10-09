// resources/js/modules/products/types/http.types.ts

import { Product } from './index';

// =================================================================
// Query Parameters for GET Requests
// =================================================================

/**
 * Defines the shape of the query parameters object for fetching the product list.
 * Based on the API documentation for the GET /products endpoint.
 */
export interface ProductListQuery {
    page?: number;
    limit?: number;
    search?: string;
    name?: string;
    category?: string; // slug
    brand?: string; // slug
    price_min?: number;
    price_max?: number;
    in_stock?: boolean;
    has_promotion?: boolean;
    sort_by?: 'name' | 'price' | 'created_at';
    sort_dir?: 'asc' | 'desc';
}

// =================================================================
// API Response Structures
// =================================================================

/**
 * Represents a single link in the Laravel pagination response.
 */
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

/**
 * Represents the complete paginated API response structure from Laravel.
 * This is a generic type that can be reused for any paginated resource.
 */
export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

/**
 * A specific implementation of PaginatedResponse for a list of Products.
 */
export type ProductListResponse = PaginatedResponse<Product>;

// =================================================================
// Data Transfer Objects (DTOs) for POST/PUT Requests
// =================================================================

/**
 * Data structure for creating a new product.
 * `category_ids` is an array of numbers.
 * `images` will be an array of File objects from the form input.
 */
export interface CreateProductData {
    name: string;
    sku: string;
    price: number;
    stock: number;
    description: string;
    is_active: boolean;
    brand_id: number;
    category_ids: number[];
    images?: File[];
    // Add other fields like variants later as needed
}

/**
 * Data structure for updating an existing product. All fields are optional.
 */
export type UpdateProductData = Partial<CreateProductData>;
