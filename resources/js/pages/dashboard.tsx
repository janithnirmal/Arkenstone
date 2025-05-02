import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';

import { BreadcrumbItem } from '@/types';
import AdminTable from './tables/admin-table';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col flex-wrap gap-3 lg:flex-row">
                    <div className="grid h-max w-full">
                        <div className="bg-secondary border-sidebar-border/70 dark:border-sidebar-border relative flex min-h-[100vh] w-full flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border p-5 md:min-h-min">
                            <span className="text-primary animate-pulse text-4xl">💎</span>
                            <h1 className="text-center text-2xl font-bold">Arkenstone</h1>
                            <p className="text-center text-sm text-neutral-800 dark:text-neutral-400">Mae govannen na i ven e-Commerce.</p>
                        </div>
                    </div>

                    {/* Admin Table */}
                    <div className="bg-secondary border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-5 md:min-h-min">
                        <AdminTable isRefreshing={false} />
                    </div>
                </div>
                <p className="text-center text-xs text-neutral-400">
                    Developed by{' '}
                    <Link href="https://github.com/janithnirmal" className="text-primary">
                        Janith Nirmal
                    </Link>
                </p>
                <p className="text-center text-xs text-neutral-800 dark:text-neutral-400">Version (Beta) 0.0.3</p>
            </div>
        </AppLayout>
    );
}
