// resources/js/modules/products/components/catalog/RelatedProducts.tsx

import React from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface Props {
    products: Product[];
    title?: string;
}

const RelatedProducts: React.FC<Props> = ({ products, title = "You might also like" }) => {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>

                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedProducts;