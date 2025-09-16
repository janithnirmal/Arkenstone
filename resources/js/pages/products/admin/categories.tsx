import CategoryAdminPage from '@@/modules/products/pages/CategoryAdminPage';
import PageLayout from '@@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';

export default function CategoryAdmin() {
    return (
        <PageLayout>
            <Head title="Category Management" />
            <CategoryAdminPage />
        </PageLayout>
    );
}