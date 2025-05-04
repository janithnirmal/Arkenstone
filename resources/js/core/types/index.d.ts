// custom types

export type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    
    images?: ProductImage[];
    category?: Category;
    stocks?: Stock[];
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    image?: string;
};

export type Stock = {
    id: number;
    quantity: number;
    reserved_quantity: number;
    variation_stocks: VariationStock[];
};

export type VariationStock = {
    id: number;
    stock: Stock;
    variation_option: VariationOption;
};

export type VariationOption = {
    id: number;
    name: string;
    variation: Variation;
};

export type Variation = {
    id: number;
    name: string;
};






export type ProductImage = {
    id: number;
    path: string;
    product_id: number;
};
