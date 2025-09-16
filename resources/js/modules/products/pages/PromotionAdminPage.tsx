// resources/js/modules/products/pages/PromotionAdminPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { Promotion } from '../types';
import { promotionService } from '../services/promotionService';
import PromotionList from '../components/promotion-admin/PromotionList';
import PromotionForm from '../components/promotion-admin/PromotionForm';
import { PaginatedResponse } from '../types/http.types';

const PromotionAdminPage: React.FC = () => {
    const [promoResponse, setPromoResponse] = useState<PaginatedResponse<Promotion> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

    const fetchPromotions = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await promotionService.getPromotions();
            setPromoResponse(data);
        } catch (error) {
            console.error("Failed to fetch promotions", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleOpenModalForCreate = () => {
        setEditingPromotion(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (promotion: Promotion) => {
        setEditingPromotion(promotion);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPromotion(null);
    };

    const handleFormSuccess = () => {
        handleCloseModal();
        fetchPromotions();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this promotion?')) {
            try {
                await promotionService.deletePromotion(id);
                fetchPromotions();
            } catch (error) {
                console.error('Failed to delete promotion', error);
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Promotions</h1>
                    <p className="mt-2 text-sm text-gray-700">Create and manage sales, discounts, and promotions.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button type="button" onClick={handleOpenModalForCreate} className="btn-primary">
                        Add Promotion
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <PromotionList
                    promotions={promoResponse?.data || []}
                    onEdit={handleOpenModalForEdit}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                />
                {/* Add Pagination controls if needed */}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-2xl rounded-lg bg-white text-left shadow-xl">
                            <div className="bg-white p-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
                                </h3>
                                <div className="mt-4">
                                    <PromotionForm
                                        promotionToEdit={editingPromotion}
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

export default PromotionAdminPage;