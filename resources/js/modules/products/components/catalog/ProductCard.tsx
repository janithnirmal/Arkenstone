// resources/js/modules/products/components/catalog/ProductCard.tsx

import React from 'react';
import { Product } from '../../types';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];

    return (
        <div className="group relative border rounded-lg overflow-hidden transition-shadow hover:shadow-lg">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                <img
                    src={primaryImage?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <h3 className="text-sm text-gray-700">
                    {/* In a real app, this would be a <Link> from react-router-dom */}
                    <a href={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                    </a>
                </h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductCard;