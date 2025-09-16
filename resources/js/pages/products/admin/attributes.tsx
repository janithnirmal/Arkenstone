import AttributeAdminPage from '@@/modules/products/pages/AttributeAdminPage';
import PageLayout from '@@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';

export default function AttributeAdmin() {
    return (
        <PageLayout>
            <Head title="Attribute Management" />
            <AttributeAdminPage />
        </PageLayout>
    );
}