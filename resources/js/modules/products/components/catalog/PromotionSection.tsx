// resources/js/modules/products/components/catalog/PromotionSection.tsx

import React from 'react';
import { Promotion } from '../../types';
import ProductCard from './ProductCard';

interface Props {
    promotion: Promotion;
}

const PromotionSection: React.FC<Props> = ({ promotion }) => {
    // In a real app, this link would be dynamic based on the promotion type and entity_id
    const viewAllLink = `/products?promotion_id=${promotion.id}`;

    return (
        <div className="py-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{promotion.title}</h2>
                    {promotion.description && <p className="mt-2 text-lg text-gray-600">{promotion.description}</p>}
                </div>
                {/* add a "View All" link later if the API supports it */}
                {/* <a href={viewAllLink} className="text-blue-600 hover:text-blue-800 font-semibold">View All &rarr;</a> */}
            </div>

            {promotion.products && promotion.products.length > 0 ? (
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {promotion.products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Details for this promotion are coming soon.</p>
            )}
        </div>
    );
};

export default PromotionSection;