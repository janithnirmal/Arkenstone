import { BreadcrumbItem } from '@/types';
import CreateAdminDialog from '@core/components/dialogs/create-admin-dialog';
import AdminTable from '@site/components/tables/admin-table';
import AppLayout from '@core/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Admins() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admins',
            href: '/admins',
        },
    ];

    const [isRefreshing, setIsRefreshing] = useState(false);

    function handleRefresh() {
        setIsRefreshing(!isRefreshing);
    }

    function handleCreateAdmin() {
        return <CreateAdminDialog successCallback={handleRefresh} />;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admins" />
            <div className="flex flex-col gap-4 p-3">
                <h1 className="text-2xl font-bold">Admins</h1>
            </div>
            <div className="flex flex-col gap-2 px-3">
                <AdminTable children={<CreateAdminDialog successCallback={handleRefresh} />} isRefreshing={isRefreshing} />
            </div>
        </AppLayout>
    );
}
