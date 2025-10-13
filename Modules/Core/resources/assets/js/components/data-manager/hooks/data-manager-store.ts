import { create } from 'zustand';
import { apiGet, ApiOptions } from '../../../lib/api';
import { ModalTypes } from '../types';

export interface DataManagerStore {
    data: any[];
    loading: boolean;
    error: string | null;
    isModalOpen: boolean;
    modalMode: ModalTypes;
    selectedItem: any | null;
    fetchData: (url: string, options?: ApiOptions) => Promise<void>;
    openModal: (mode: ModalTypes, item?: any) => void;
    closeModal: () => void;
}

const useDataManagerStore = create<DataManagerStore>((set, get) => ({
    data: [],
    loading: true,
    error: null,
    isModalOpen: false,
    modalMode: null,
    selectedItem: null,
    fetchData: async (url: string, options?: ApiOptions) => {
        set({ loading: true, error: null });
        try {
            const result = await apiGet(url, {
                displayError: true,
                ...options,
            });
            set({ data: result.data || [], loading: false });
        } catch (e: any) {
            set({ error: e.message || 'Failed to fetch data', loading: false });
        }
    },
    openModal: (mode: ModalTypes, item = null) => {
        set({ isModalOpen: true, modalMode: mode, selectedItem: item });
    },
    closeModal: () => {
        set({ isModalOpen: false, modalMode: null, selectedItem: null });
    },
}));

export default useDataManagerStore;
