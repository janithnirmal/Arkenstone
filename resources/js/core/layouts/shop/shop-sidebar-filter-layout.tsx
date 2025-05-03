import Filter from '@/core/pages/shop/filter';
import Listing from '@/core/pages/shop/listing';
import Search from '@/core/pages/shop/search';
import { Category } from '@/core/types';
import { Head } from '@inertiajs/react';
import { createContext, PropsWithChildren, useState } from 'react';

// Define possible filter option types
export type FilterOption = {
    categories?: Category[];
    search?: string;
    // Add other filter types here as needed (e.g., brands?: Brand[])
};

// Map filter keys to their corresponding value types
export type FilterOptionValueMap = {
    categories?: Category[];
    search?: string;
    // Add other mappings (e.g., brands: Brand[])
};

export type FilterContextType = {
    filterOption: FilterOption;
    updateFilter: <K extends keyof FilterOption>(key: K, value: FilterOptionValueMap[K]) => void;
};

export const FilterContext = createContext<FilterContextType>({
    filterOption: {},
    updateFilter: () => {},
});

export default function ShopSidebarFilterLayout({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState(false);

    const [filterOption, setFilterOption] = useState<FilterOption>({});

    const updateFilter = <K extends keyof FilterOption>(key: K, value: FilterOptionValueMap[K]) => {
        setFilterOption((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <FilterContext.Provider value={{ filterOption, updateFilter }}>
            <Head title="Shop" />
            <main className="bg-background relative flex" style={{ boxSizing: 'border-box' }}>
                <Filter isOpen={isOpen} setIsOpen={setIsOpen} />
                <div className="flex h-screen w-full flex-col pe-2 z-10">
                    <Search isOpen={isOpen} setIsOpen={setIsOpen} />
                    <Listing />
                </div>
            </main>
            {children}
        </FilterContext.Provider>
    );
}
