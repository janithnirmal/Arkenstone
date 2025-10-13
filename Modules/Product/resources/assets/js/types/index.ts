/**
 * Represents a single image of a product.
 */
export interface ProductImage {
    id: number;
    product_id: number;
    url: string;
    alt_text?: string | null;
    is_primary: boolean;
    order: number;
}

/**
 * Represents the brand of a product.
 */
export interface Brand {
    id: number;
    name: string;
    slug: string;
    logo?: string | null;
}

/**
 * Represents a category that a product belongs to.
 */
export interface Category {
    id: number;
    parent_id?: number | null;
    name: string;
    slug: string;
}

/**
 * Represents the main product data structure.
 */
export interface Product {
    id: number;
    brand_id: number;
    name: string;
    description?: string | null;
    sku: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    categories?: Category[];
    brand?: Brand;
    images?: ProductImage[];
    price: number;
    discount_type?: number;
    discount_value?: number;
    quantity: number;
    final_price: number;
}

/**
 * Props for the ProductCard component.
 */
export interface ProductCardProps {
    data: Product;
}
