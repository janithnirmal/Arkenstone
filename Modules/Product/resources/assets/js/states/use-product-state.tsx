import { productService } from '@product/services/product-service';
import { create } from 'zustand';
import { Product } from '../types';
import { PaginatedResponse } from '../types/http.types';

interface CatalogueState {
    loading: boolean;
    products: PaginatedResponse<Product> | null;
    filters: {
        name?: string;
        categories: number[];
    };

    setFilters: (by: any) => void;
    fetchData: () => Promise<void>;
}

export const useProductsState = create<CatalogueState>()((set, get) => ({
    products: null,
    filters: { categories: [] },
    loading: false,

    setFilters: (updates) => set((s) => ({ filters: { ...s.filters, ...updates } })),

    fetchData: async () => {
        set({ loading: true });
        try {
            const data = await productService.getProducts(get().filters);
            console.log('Fetched products:', data);

            set({ products: data });
        } finally {
            set({ loading: false });
        }
    },
}));
