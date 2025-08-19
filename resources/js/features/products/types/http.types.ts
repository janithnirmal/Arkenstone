// Add these new types to your existing product types file
import { Product } from '.';

/**
 * Data structure for creating a new product.
 * Images are represented as File objects from a form input.
 */
export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    categories?: number[];
    terms?: number[];
    images?: File[];
}

/**
 * Data structure for updating an existing product.
 * All fields are optional.
 */
export interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    stock_quantity?: number;
    categories?: number[];
    terms?: number[];
    images?: File[]; // For new images to upload
    images_to_delete?: number[]; // For existing images to remove
    primary_image_id?: number; // To set a new primary image
}

// Responses
// Best placed in your API service layer, e.g., `/src/services/productService.ts`

/**
 * Represents a single link in the Laravel pagination response.
 */
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

/**
 * Represents the complete paginated API response for the product catalog.
 * It's a generic type, allowing it to be reused for any paginated resource.
 */
export interface PaginatedResponse<T> {
    current_page: number;
    data: T[]; // The array of items for the current page
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
 * A specific implementation of the PaginatedResponse for a list of Products.
 * This is the type you'll use for the state that holds your product list.
 */
export type CatalogResult = PaginatedResponse<Product>;

// This is useful for building a filter UI or a typesafe API client.

/**
 * Defines the available sorting options for product queries.
 */
export type ProductSortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';


/**
 * Represents the shape of the query parameters object for filtering products.
 * All properties are optional, matching the 'sometimes' rule in Laravel.
 */
export interface ProductQuery {
    id?: number;
    categories?: number[];
    taxonomies?: number[];
    min_price?: number;
    max_price?: number;
    sort_by?: ProductSortOption;
    per_page?: number;
    page?: number; // Don't forget the page number for pagination!
}
