// resources/js/modules/products/services/promotionService.ts

import { apiDelete, apiGet, apiPost, apiPut } from '@@/core/lib/api';
import { Promotion } from '../types';
import { PaginatedResponse } from '../types/http.types';

/**
 * Data structure for creating or updating a promotion.
 */
export interface PromotionFormData {
    title: string;
    description?: string;
    type: 'product' | 'category' | 'brand' | 'global'; // Added 'brand' and 'global' for completeness
    entity_id?: number | null; // Nullable for global promotions
    discount_percent: number;
    start_date: string; // Should be in 'YYYY-MM-DD' format
    end_date: string;   // Should be in 'YYYY-MM-DD' format
    is_active: boolean;
}

/**
 * Fetches a paginated list of promotions.
 * @returns A promise resolving to a paginated response of Promotion objects.
 */
const getPromotions = (): Promise<PaginatedResponse<Promotion>> => {
    return apiGet('/promotions');
};

/**
 * Creates a new promotion.
 * @param data The data for the new promotion.
 * @returns The newly created promotion.
 */
const createPromotion = (data: PromotionFormData): Promise<Promotion> => {
    return apiPost('/promotions', { data, displaySuccess: true });
};

/**
 * Updates an existing promotion.
 * @param id The ID of the promotion to update.
 * @param data The data to update.
 * @returns The updated promotion.
 */
const updatePromotion = (id: number, data: PromotionFormData): Promise<Promotion> => {
    return apiPut(`/promotions/${id}`, { data, displaySuccess: true });
};

/**
 * Deletes a promotion.
 * @param id The ID of the promotion to delete.
 */
const deletePromotion = (id: number): Promise<void> => {
    return apiDelete(`/promotions/${id}`, { displaySuccess: true });
};

/**
 * Fetches a list of all currently active promotions for the customer-facing page.
 * Assumes the backend is eager-loading sample products with each promotion.
 * @returns A promise resolving to an array of active Promotion objects.
 */
const getActivePromotions = (): Promise<Promotion[]> => {
    // apiGet utility will correctly append these params to the URL
    // e.g., /api/v1/promotions?is_active=true
    return apiGet('/promotions', { params: { is_active: true } });
};

export const promotionService = {
    getPromotions, // For admin
    getActivePromotions, // For customer
    createPromotion,
    updatePromotion,
    deletePromotion,
};