// resources/js/modules/products/pages/CatalogPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { Brand, Category, Product } from '../types';
import { ProductListQuery, ProductListResponse } from '../types/http.types';
import FilterSidebar from '../components/catalog/FilterSidebar';
import ProductCard from '../components/catalog/ProductCard';
import Pagination from '../components/shared/Pagination';

const CatalogPage: React.FC = () => {
    const [productResponse, setProductResponse] = useState<ProductListResponse | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<ProductListQuery>({});

    const fetchProducts = useCallback(async (currentFilters: ProductListQuery) => {
        setIsLoading(true);
        try {
            const data = await productService.getProducts(currentFilters);
            setProductResponse(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect for fetching filter data (categories, brands) only once
    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [categoryData, brandData] = await Promise.all([
                    productService.getCategories(),
                    productService.getBrands(),
                ]);
                setCategories(categoryData);
                setBrands(brandData);
            } catch (error) {
                console.error("Failed to fetch filter data", error);
            }
        };
        fetchFilterData();
    }, []);
    
    // Effect for fetching products whenever the filters change
    useEffect(() => {
        // Debounce mechanism for price inputs
        const handler = setTimeout(() => {
            fetchProducts(filters);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [filters, fetchProducts]);

    const handleFilterChange = (key: keyof ProductListQuery, value: string | number | undefined) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };
            // Reset to page 1 when any filter other than 'page' is changed
            if (key !== 'page') {
                delete newFilters.page;
            }
            return newFilters;
        });
    };
    
    const handlePageChange = (page: number) => {
        handleFilterChange('page', page);
    };

    return (
        <div className="bg-white">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-baseline justify-between border-b border-gray-200 pt-12 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Product Catalog</h1>
                    {/* Optional: Add Sorting Dropdown Here */}
                </div>

                <section className="pt-6 pb-24">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                        {/* Filters */}
                        <div className="hidden lg:block">
                             <FilterSidebar
                                categories={categories}
                                brands={brands}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                            />
                        </div>

                        {/* Product Grid */}
                        <div className="lg:col-span-3">
                           {isLoading ? (
                                <p>Loading products...</p> // Replace with skeleton loader for better UX
                           ) : (
                               <>
                                   <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                                       {productResponse?.data.map(product => (
                                           <ProductCard key={product.id} product={product} />
                                       ))}
                                   </div>
                                   {productResponse && productResponse.links.length > 3 && (
                                       <Pagination links={productResponse.links} onPageChange={handlePageChange} />
                                   )}
                               </>
                           )}
                           {!isLoading && productResponse?.data.length === 0 && (
                                <p className="text-center text-gray-500">No products found matching your criteria.</p>
                           )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CatalogPage;