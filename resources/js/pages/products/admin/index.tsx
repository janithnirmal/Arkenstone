import ProductAdminPage from '@@/modules/products/pages/ProductAdminPage';
import PageLayout from '@@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';

export default function ProductAdminIndex() {
    return (
        <PageLayout>
            <Head title="Product Management" />
            <ProductAdminPage />
        </PageLayout>
    );
}