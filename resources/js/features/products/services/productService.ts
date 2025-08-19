import { apiGet } from '@/core/lib/api';
import { Product } from '@/core/types';

const getProducts = async (): Promise<Product[]> => {
    const response = await apiGet('/products');
    console.log(response);
    return response;
};

export const productService = {
    getProducts,
};
