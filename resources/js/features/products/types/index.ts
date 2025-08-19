/**
 * Represents the base structure for a Laravel pivot table relationship.
 */
export interface Pivot {
    product_id: number;
    category_id?: number;
    term_id?: number;
}

/**
 * Represents a single Product Image.
 * Note: `is_primary` is converted to a boolean for easier use in React.
 */
export interface ProductImage {
    id: number;
    product_id: number;
    path: string; // This would ideally be converted to a full URL
    alt_text: string | null;
    is_primary: boolean; // Converted from 0/1 to true/false
    created_at: string;
    updated_at: string;
}

/**
 * Represents a single Product Category.
 */
export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    pivot: Pivot;
}

/**
 * Represents a Taxonomy group (e.g., "Material", "Collection").
 */
export interface Taxonomy {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

/**
 * Represents a single Term within a Taxonomy (e.g., "Cotton").
 */
export interface Term {
    id: number;
    taxonomy_id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    pivot: Pivot;
    taxonomy: Taxonomy;
}

/**
 * Represents the complete, detailed Product object.
 * This is the central type definition for a single product.
 */
export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
    images: ProductImage[];
    categories: Category[];
    terms: Term[];
}
