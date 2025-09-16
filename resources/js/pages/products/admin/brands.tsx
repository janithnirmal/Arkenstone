import BrandAdminPage from '@@/modules/products/pages/BrandAdminPage';
import PageLayout from '@@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';

export default function BrandAdmin() {
    return (
        <PageLayout>
            <Head title="Brand Management" />
            <BrandAdminPage />
        </PageLayout>
    );
}