// resources/js/modules/products/pages/PromotionsPage.tsx

import React, { useEffect, useState } from 'react';
import { promotionService } from '../services/promotionService';
import { Promotion } from '../types';
import PromotionSection from '../components/catalog/PromotionSection';

const PromotionsPage: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await promotionService.getActivePromotions();
                setPromotions(data);
            } catch (err) {
                setError("Could not load promotions at this time. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-center py-20">Loading our latest deals...</p>;
        }
        if (error) {
            return <p className="text-center py-20 text-red-500">{error}</p>;
        }
        if (promotions.length === 0) {
            return <p className="text-center py-20 text-gray-600">There are no active promotions right now. Check back soon!</p>;
        }
        return (
            <div className="divide-y divide-gray-200">
                {promotions.map(promo => (
                    <PromotionSection key={promo.id} promotion={promo} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200 pt-12 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Current Promotions</h1>
                    <p className="mt-4 text-xl text-gray-500">Shop our latest sales and find your next favorite item.</p>
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default PromotionsPage;