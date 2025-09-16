// resources/js/modules/products/pages/PromotionsPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { promotionService } from '../services/promotionService';
import { Category, Promotion } from '../types';
import PromotionSection from '../components/catalog/PromotionSection';
import FilterSidebar from '../components/shared/FilterSidebar';
import { ProductListQuery } from '../types/http.types';
import { productService } from '../services/productService';

const PromotionsPage: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<ProductListQuery>({});

    // Fetch promotions based on filters
    const fetchPromotions = useCallback(async (currentFilters: ProductListQuery) => {
        setIsLoading(true);
        setError(null);
        try {
            // This assumes your backend API for promotions can accept a `category` filter
            const data = await promotionService.getActivePromotions(currentFilters);
            setPromotions(data);
        } catch (err) {
            setError("Could not load promotions.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

     // Fetch static filter data (categories) once
    useEffect(() => {
        productService.getCategories().then(setCategories).catch(err => console.error("Failed to fetch categories", err));
    }, []);

    // Re-fetch promotions when filters change
    useEffect(() => {
        fetchPromotions(filters);
    }, [filters, fetchPromotions]);

    const handleFilterChange = (key: keyof ProductListQuery, value: string | number | undefined) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // useEffect(() => {
    //     const fetchPromotions = async () => {
    //         setIsLoading(true);
    //         setError(null);
    //         try {
    //             const data = await promotionService.getActivePromotions();
    //             setPromotions(data);
    //         } catch (err) {
    //             setError("Could not load promotions at this time. Please try again later.");
    //             console.error(err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchPromotions();
    // }, []);

    // const renderContent = () => {
    //     if (isLoading) {
    //         return <p className="text-center py-20">Loading our latest deals...</p>;
    //     }
    //     if (error) {
    //         return <p className="text-center py-20 text-red-500">{error}</p>;
    //     }
    //     if (promotions.length === 0) {
    //         return <p className="text-center py-20 text-gray-600">There are no active promotions right now. Check back soon!</p>;
    //     }
    //     return (
    //         <div className="divide-y divide-gray-200">
    //             {promotions.map(promo => (
    //                 <PromotionSection key={promo.id} promotion={promo} />
    //             ))}
    //         </div>
    //     );
    // };

    // return (
    //     <div className="bg-white">
    //         <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    //             <div className="border-b border-gray-200 pt-12 pb-6">
    //                 <h1 className="text-4xl font-bold tracking-tight text-gray-900">Current Promotions</h1>
    //                 <p className="mt-4 text-xl text-gray-500">Shop our latest sales and find your next favorite item.</p>
    //             </div>
    //             {renderContent()}
    //         </main>
    //     </div>
    // );

    return (
        <div className="bg-white">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200 pt-12 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Current Promotions</h1>
                    <p className="mt-4 text-xl text-gray-500">Shop our latest sales and find your next favorite item.</p>
                </div>
                
                {/* --- 4. Add the Sidebar to the layout --- */}
                <section className="pt-6 pb-24">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                        <div className="hidden lg:block">
                            <FilterSidebar
                                categories={categories}
                                // We are not passing `brands`, so that section will not render
                                filters={filters}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                        <div className="lg:col-span-3">
                            {/* Original renderContent logic goes here */}
                            {isLoading ? <p>Loading deals...</p> : promotions.length === 0 ? <p>No promotions match your criteria.</p> : (
                                <div className="divide-y divide-gray-200">
                                    {promotions.map(promo => (
                                        <PromotionSection key={promo.id} promotion={promo} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );

};

export default PromotionsPage;