import CatalogPage from '@/modules/products/pages/CatalogPage';
import PageLayout from '@@/core/layouts/page-layout'; 
import { Head } from '@inertiajs/react';

export default function ProductCatalog() {
    return (
        <PageLayout>
            <Head title="Our Products" />
            <CatalogPage />
        </PageLayout>
    );
}