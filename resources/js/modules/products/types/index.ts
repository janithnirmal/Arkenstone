// resources/js/modules/products/types/index.ts

/**
 * Represents a single Product Image.
 */
export interface ProductImage {
    id: number;
    product_id: number;
    url: string;
    is_primary: boolean;
}

/**
 * Represents a Product Category.
 */
export interface Category {
    id:number;
    parent_id?: number;
    name: string;
    slug: string;
    children?: Category[]; // For nested categories
}

/**
 * Represents a Brand.
 */
export interface Brand {
    id: number;
    name: string;
    slug: string;
    logo?: string;
}

/**
 * Represents a single option for a product variant, like "Red" or "Large".
 */
export interface AttributeValue {
    id: number;
    attribute_id: number;
    value: string;
}

/**
 * Represents a product variant with its own SKU, price, and stock.
 */
export interface ProductVariant {
    id: number;
    product_id: number;
    name: string; // e.g., "Red / Large"
    sku: string;
    price: number;
    stock: number;
}

/**
 * Represents a Promotion that can be applied to products or categories.
 */
export interface Promotion {
    id: number;
    title: string;
    description?: string;
    type: 'product' | 'category' | 'taxonomy' | 'global';
    entity_id: number;
    discount_percent: number;
    start_date: string; // ISO 8601 date string
    end_date: string;   // ISO 8601 date string
    is_active: boolean;
}

/**
 * The primary interface representing a complete Product object.
 * This is the central data model for our module.
 */
export interface Product {
    id: number;
    name: string;
    description: string;
    sku: string;
    price: number;
    discount_price?: number;
    tax_rate?: number;
    stock: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;

    // Relationships
    images: ProductImage[];
    categories: Category[];
    brand?: Brand;
    variants: ProductVariant[];
    attributes: AttributeValue[];
    promotions?: Promotion[]; // A product might have direct promotions
}