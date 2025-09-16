// resources/js/modules/products/components/product-admin/ProductListTable.tsx

import React from 'react';
import { Product } from '../../types';
import { PaginatedResponse } from '../../types/http.types';

interface Props {
    paginatedProducts: PaginatedResponse<Product>;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onPageChange: (page: number) => void;
    isLoading: boolean;
}

const ProductListTable: React.FC<Props> = ({ paginatedProducts, onEdit, onDelete, onPageChange, isLoading }) => {
    const { data = [], current_page, last_page, from, to, total } = paginatedProducts;

    const renderPaginationLinks = () => {
        if (!paginatedProducts.links) return null;
        return paginatedProducts.links.map((link, index) => {
            const isFirst = link.label.includes('Previous');
            const isNext = link.label.includes('Next');
            const pageNumber = parseInt(link.label, 10);

            if (!link.url && (isFirst || isNext)) {
                return null;
            }

            return (
                <button
                    key={index}
                    onClick={() => onPageChange(pageNumber)}
                    disabled={link.active || !link.url}
                    className={`px-3 py-1 mx-1 text-sm rounded-md transition-colors
                        ${link.active ? 'bg-blue-600 text-white cursor-default' : 'bg-white text-gray-700 hover:bg-gray-100'}
                        ${!link.url ? 'text-gray-400 cursor-not-allowed' : ''}
                    `}
                >
                    {isFirst ? '«' : isNext ? '»' : link.label}
                </button>
            );
        });
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10">Loading...</td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500">No products found.</td>
                            </tr>
                        ) : (
                            data.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.is_active ? 'Active' : 'Archived'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!isLoading && data.length > 0 && (
                <div className="px-6 py-4 flex items-center justify-between border-t">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of <span className="font-medium">{total}</span> results
                    </div>
                    <div className="flex">
                        {renderPaginationLinks()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductListTable;