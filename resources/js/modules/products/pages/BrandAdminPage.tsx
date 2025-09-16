// resources/js/modules/products/pages/BrandAdminPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import BrandForm from '../components/brand-admin/BrandForm';
import BrandList from '../components/brand-admin/BrandList';
import { brandService } from '../services/brandService';
import { Brand } from '../types';

const BrandAdminPage: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // Add state for pagination if you implement it fully
    // const [paginationInfo, setPaginationInfo] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const fetchBrands = useCallback(async () => {
        setIsLoading(true);
        try {
            // The service returns a paginated response
            const response = await brandService.getBrands();
            setBrands(response.data);
            // setPaginationInfo({ ...response, data: undefined });
        } catch (error) {
            console.error("Failed to fetch brands", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const handleOpenModalForCreate = () => {
        setEditingBrand(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBrand(null);
    };

    const handleFormSuccess = () => {
        handleCloseModal();
        fetchBrands(); // Refresh the list
    };

    const handleDeleteBrand = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            try {
                await brandService.deleteBrand(id);
                fetchBrands();
            } catch (error) {
                console.error('Failed to delete brand', error);
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Brands</h1>
                    <p className="mt-2 text-sm text-gray-700">Manage the brands for your products.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleOpenModalForCreate}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        Add Brand
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <BrandList
                    brands={brands}
                    onEdit={handleOpenModalForEdit}
                    onDelete={handleDeleteBrand}
                    isLoading={isLoading}
                />
                {/* Add Pagination controls here if needed */}
            </div>

            {/* Modal for Add/Edit Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-lg rounded-lg bg-white text-left shadow-xl">
                            <div className="bg-white p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                                </h3>
                                <div className="mt-4">
                                    <BrandForm
                                        brandToEdit={editingBrand}
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

export default BrandAdminPage;