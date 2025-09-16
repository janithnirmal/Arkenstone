// resources/js/modules/products/components/category-admin/CategoryList.tsx

import React from 'react';
import { Category } from '../../types';

interface Props {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
    isLoading: boolean;
}

// Helper function to flatten the category tree and add depth for indentation
const flattenCategories = (categories: Category[], depth = 0): (Category & { depth: number })[] => {
    let flatList: (Category & { depth: number })[] = [];
    for (const category of categories) {
        flatList.push({ ...category, depth });
        if (category.children && category.children.length > 0) {
            flatList = flatList.concat(flattenCategories(category.children, depth + 1));
        }
    }
    return flatList;
};


const CategoryList: React.FC<Props> = ({ categories, onEdit, onDelete, isLoading }) => {

    const flatCategories = flattenCategories(categories);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="text-center py-10">Loading...</td>
                            </tr>
                        ) : flatCategories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-500">No categories found.</td>
                            </tr>
                        ) : (
                            flatCategories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <span style={{ paddingLeft: `${category.depth * 20}px` }}>
                                            {category.depth > 0 && '↳ '}
                                            {category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => onEdit(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => onDelete(category.id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default CategoryList;