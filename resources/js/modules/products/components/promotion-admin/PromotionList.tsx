// resources/js/modules/products/components/promotion-admin/PromotionList.tsx

import React from 'react';
import { Promotion } from '../../types';

interface Props {
    promotions: Promotion[];
    onEdit: (promotion: Promotion) => void;
    onDelete: (id: number) => void;
    isLoading: boolean;
}

const PromotionList: React.FC<Props> = ({ promotions, onEdit, onDelete, isLoading }) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Dates</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={6} className="text-center py-10">Loading...</td></tr>
                        ) : promotions.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-500">No promotions found.</td></tr>
                        ) : (
                            promotions.map((promo) => (
                                <tr key={promo.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promo.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{promo.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">{promo.discount_percent}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(promo.start_date)} - {formatDate(promo.end_date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${promo.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {promo.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => onEdit(promo)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => onDelete(promo.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PromotionList;