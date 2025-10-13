import { ProductCardProps } from '../../types';

import React from 'react';

const SimpleProductCard: React.FC<ProductCardProps> = ({ data }) => {
    // Gracefully handle potentially missing data to prevent UI breakage
    const { name = 'Untitled Product', brand, images, price = 0, final_price = 0, discount_value = 0, categories } = data || {};

    const hasDiscount = final_price > 0 && final_price < price;
    const displayPrice = hasDiscount ? final_price : price;
    const originalPrice = hasDiscount ? price : null;

    const primaryCategory = categories && categories.length > 0 ? categories[0].name : 'Uncategorized';
    const brandName = brand?.name || 'Generic Brand';
    const imageUrl = images?.[0].url || 'https://via.placeholder.com/800x800/f0f0f0/333333?text=No+Image';
    const altText = data?.images?.[0]?.alt_text || `Image of ${name}`;

    return (
        <div className="group relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
            <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                <img className="peer absolute top-0 right-0 h-full w-full object-cover" src={imageUrl} alt={altText} />
                <img
                    className="peer absolute top-0 -right-96 h-full w-full object-cover transition-all delay-100 duration-1000 peer-hover:right-0 hover:right-0"
                    src={imageUrl.replace('A9A9A9', 'a2c4b2')} // Example of a hover effect for a secondary image if available
                    alt={`Hover view of ${name}`}
                />
                {hasDiscount && (
                    <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
                        {`${Math.round(((price - final_price) / price) * 100)}% OFF`}
                    </span>
                )}
            </div>
            <div className="mt-4 px-5 pb-5">
                <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-500">{brandName.toUpperCase()}</p>
                    <h5 className="truncate text-xl tracking-tight text-slate-900">{name}</h5>
                </div>
                <p className="mb-4 truncate text-sm text-gray-600">{primaryCategory}</p>
                <div className="flex items-center justify-between">
                    <p>
                        <span className="text-3xl font-bold text-slate-900">${displayPrice.toFixed(2)}</span>
                        {originalPrice && <span className="ml-2 text-sm text-slate-900 line-through">${originalPrice.toFixed(2)}</span>}
                    </p>
                    <button className="flex items-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:ring-4 focus:ring-blue-300 focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimpleProductCard;
