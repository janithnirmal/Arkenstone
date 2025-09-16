// resources/js/modules/products/components/catalog/ProductCard.tsx

import React from 'react';
import { Product } from '../../types';

// interface Props {
//     product: Product;
// }

// const ProductCard: React.FC<Props> = ({ product }) => {
//     const primaryImage = product.images.find(img => img.is_primary) || product.images[0];

//     return (
//         <div className="group relative border rounded-lg overflow-hidden transition-shadow hover:shadow-lg">
//             <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
//                 <img
//                     src={primaryImage?.url || 'https://via.placeholder.com/300'}
//                     alt={product.name}
//                     className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
//                 />
//             </div>
//             <div className="p-4">
//                 <h3 className="text-sm text-gray-700">
//                     {/* In a real app, this would be a <Link> from react-router-dom */}
//                     <a href={`/products/${product.id}`}>
//                         <span aria-hidden="true" className="absolute inset-0" />
//                         {product.name}
//                     </a>
//                 </h3>
//                 <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
//             </div>
//         </div>
//     );
// };

interface Props {
    product: Product;
    // For integration with a router, you would pass the Link component as a prop
    // Example: LinkComponent={Link} from 'react-router-dom'
    LinkComponent?: React.ElementType; 
}

const ProductCard: React.FC<Props> = ({ product, LinkComponent = 'a' }) => {
    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
    const isOutOfStock = product.stock === 0;
    const onSale = typeof product.discount_price === 'number' && product.discount_price < product.price;

    return (
        <div className="group relative border rounded-lg overflow-hidden flex flex-col">
            <LinkComponent to={`/products/${product.id}`} className="absolute inset-0 z-10" aria-hidden="true">
                <span className="sr-only">View product</span>
            </LinkComponent>
            
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 relative">
                <img
                    src={primaryImage?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                />
                
                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                        <span className="font-semibold text-gray-700">Out of Stock</span>
                    </div>
                )}

                {/* Sale Badge */}
                {onSale && !isOutOfStock && (
                     <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Sale
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm text-gray-700 font-medium flex-grow">
                    {product.name}
                </h3>
                <div className="mt-2 flex items-baseline justify-between">
                    {onSale ? (
                        <p>
                            <span className="text-lg font-bold text-red-600">${product.discount_price?.toFixed(2)}</span>
                            <span className="ml-2 text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                        </p>
                    ) : (
                        <p className="text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;