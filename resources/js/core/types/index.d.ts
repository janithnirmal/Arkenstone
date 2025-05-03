// custom types

export type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    
    images?: ProductImage[];
    category?: Category;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    image?: string;
};

export type ProductImage = {
    id: number;
    path: string;
    product_id: number;
};
