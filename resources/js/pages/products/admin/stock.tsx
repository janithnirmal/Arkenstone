import StockManagementPage from '@@/modules/products/pages/StockManagementPage';
import PageLayout from '@@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';

export default function StockAdmin() {
    return (
        <PageLayout>
            <Head title="Stock Management" />
            <StockManagementPage />
        </PageLayout>
    );
}