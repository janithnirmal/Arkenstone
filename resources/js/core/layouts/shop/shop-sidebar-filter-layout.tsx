import Filter from '@/core/pages/shop/filter';
import Listing from '@/core/pages/shop/listing';
import Search from '@/core/pages/shop/search';
import { Category } from '@/core/types';
import { Head } from '@inertiajs/react';
import { createContext, PropsWithChildren, useState } from 'react';

// Define possible filter option types
export type FilterOptions = {
    categories?: Category[];
    // Add other filter types here as needed (e.g., brands?: Brand[])
};

// Map filter keys to their corresponding value types
export type FilterOptionsValueMap = {
    categories?: Category[];
    // Add other mappings (e.g., brands: Brand[])
};

export type FilterContextType = {
    filterOptions: FilterOptions;
    updateFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptionsValueMap[K]) => void;
};

// Map search keys to their corresponding value types
export type SearchOptionsValueMap = {
    search?: string;
    filterOptions?: FilterOptions;
    updateFilter?: <K extends keyof FilterOptions>(key: K, value: FilterOptionsValueMap[K]) => void;
};

// Define SearchOptions as a concrete object type
export type SearchOptions = {
    filterOptions: FilterOptions;
    search?: string;
    updateSearch: <K extends keyof SearchOptionsValueMap>(key: K, value: SearchOptionsValueMap[K]) => void;
};

export const FilterContext = createContext<FilterContextType>({
    filterOptions: {},
    updateFilter: () => {},
});

export const SearchContext = createContext<SearchOptions>({
    filterOptions: {},
    search: '',
    updateSearch: () => {},
});

export default function ShopSidebarFilterLayout({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState(false);

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
    const [searchOptions, setSearchOptions] = useState<SearchOptions>({
        filterOptions: {},
        search: '',
        updateSearch: () => {},
    });

    const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptionsValueMap[K]) => {
        setFilterOptions((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateSearch = <K extends keyof SearchOptionsValueMap>(key: K, value: SearchOptionsValueMap[K]) => {
        setSearchOptions((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <SearchContext.Provider value={{ filterOptions, search: searchOptions.search, updateSearch: updateSearch }}>
            <FilterContext.Provider value={{ filterOptions, updateFilter }}>
                <Head title="Shop" />
                <main className="bg-background relative flex" style={{ boxSizing: 'border-box' }}>
                    <Filter isOpen={isOpen} setIsOpen={setIsOpen} />
                    <div className="z-10 flex h-screen w-full flex-col pe-2">
                        <Search isOpen={isOpen} setIsOpen={setIsOpen} />
                        <Listing />
                    </div>
                </main>
                {children}
            </FilterContext.Provider>
        </SearchContext.Provider>
    );
}
