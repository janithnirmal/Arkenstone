import PromotionsPage from '@@/modules/products/pages/PromotionsPage';
import PageLayout from '@@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';

export default function Promotions() {
    return (
        <PageLayout>
            <Head title="Promotions" />
            <PromotionsPage />
        </PageLayout>
    );
}