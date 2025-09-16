// resources/js/modules/products/pages/CategoryAdminPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import CategoryForm from '../components/category-admin/CategoryForm';
import CategoryList from '../components/category-admin/CategoryList';
import { categoryService } from '../services/categoryService';
import { Category } from '../types';

const CategoryAdminPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for the Add/Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleOpenModalForCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleFormSuccess = () => {
        handleCloseModal();
        fetchCategories(); // Refresh the list
    };

    const handleDeleteCategory = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category? Note: This might fail if products are using it.')) {
            try {
                await categoryService.deleteCategory(id);
                fetchCategories(); // Refresh after delete
            } catch (error) {
                console.error('Failed to delete category', error);
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
                    <p className="mt-2 text-sm text-gray-700">Manage the categories for your products.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleOpenModalForCreate}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        Add Category
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <CategoryList
                    categories={categories}
                    onEdit={handleOpenModalForEdit}
                    onDelete={handleDeleteCategory}
                    isLoading={isLoading}
                />
            </div>

            {/* Modal for Add/Edit Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-lg rounded-lg bg-white text-left shadow-xl">
                            <div className="bg-white p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                                </h3>
                                <div className="mt-4">
                                    <CategoryForm
                                        categoryToEdit={editingCategory}
                                        allCategories={categories}
                                        onSuccess={handleFormSuccess}
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryAdminPage;