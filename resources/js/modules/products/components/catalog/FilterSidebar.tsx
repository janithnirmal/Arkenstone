// resources/js/modules/products/components/catalog/FilterSidebar.tsx

import React from 'react';
import { Brand, Category } from '../../types';
import { ProductListQuery } from '../../types/http.types';

interface Props {
    categories: Category[];
    brands: Brand[];
    filters: ProductListQuery;
    onFilterChange: (key: keyof ProductListQuery, value: string | number | undefined) => void;
}

const FilterSidebar: React.FC<Props> = ({ categories, brands, filters, onFilterChange }) => {
    return (
        <aside className="space-y-6">
            {/* Category Filter */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => onFilterChange('category', undefined)}
                            className={`text-sm ${!filters.category ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            All Categories
                        </button>
                    </li>
                    {categories.map(cat => (
                        <li key={cat.id}>
                            <button
                                onClick={() => onFilterChange('category', cat.slug)}
                                className={`text-sm ${filters.category === cat.slug ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'}`}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Brand Filter */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 border-t pt-6">Brands</h3>
                <ul className="space-y-2">
                     <li>
                        <button
                            onClick={() => onFilterChange('brand', undefined)}
                            className={`text-sm ${!filters.brand ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            All Brands
                        </button>
                    </li>
                    {brands.map(brand => (
                        <li key={brand.id}>
                           <button
                                onClick={() => onFilterChange('brand', brand.slug)}
                                className={`text-sm ${filters.brand === brand.slug ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'}`}
                            >
                                {brand.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Price Filter */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 border-t pt-6">Price</h3>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.price_min || ''}
                        onChange={(e) => onFilterChange('price_min', e.target.value ? Number(e.target.value) : undefined)}
                        className="input-field w-full"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.price_max || ''}
                        onChange={(e) => onFilterChange('price_max', e.target.value ? Number(e.target.value) : undefined)}
                        className="input-field w-full"
                    />
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;