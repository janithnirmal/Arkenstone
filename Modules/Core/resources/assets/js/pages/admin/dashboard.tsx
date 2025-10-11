import AppLayout from '@core/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';

import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import AdminTable from '@site/components/tables/admin-table';
import Config from '../../config';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
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
                            <ArkenstoneLogo />
                            <Arkenstone />
                            <p className="text-center text-sm text-neutral-800 dark:text-neutral-400">{Config.appDescription}</p>
                        </div>
                    </div>

                    {/* Admin Table */}
                    <div className="bg-secondary border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-5 md:min-h-min">
                        <AdminTable isRefreshing={false} />
                    </div>
                </div>
                <p className="text-center text-xs text-neutral-400">
                    Developed by{' '}
                    <Link href={Config.appAuthorUrl} className="text-primary">
                        {Config.appCompany}
                    </Link>
                </p>
                <p className="text-center text-xs text-neutral-800 dark:text-neutral-400">Version (Beta) {Config.appVersion}</p>
            </div>
        </AppLayout>
    );
}

export function ArkenstoneLogo({ className }: { className?: string }) {
    return <div className={cn('text-primary flex text-center text-2xl font-bold', className)}>💎</div>;
}

export function Arkenstone({ className }: { className?: string }) {
    return (
        <div className={cn('text-primary flex text-center text-2xl font-bold', className)}>
            <div className="animate-pulse delay-0 duration-1000">A</div>
            <div className="animate-pulse delay-100 duration-1000">r</div>
            <div className="animate-pulse delay-200 duration-1000">k</div>
            <div className="animate-pulse delay-300 duration-1000">e</div>
            <div className="animate-pulse delay-400 duration-1000">n</div>
            <div className="animate-pulse delay-500 duration-1000">s</div>
            <div className="animate-pulse delay-600 duration-1000">t</div>
            <div className="animate-pulse delay-700 duration-1000">o</div>
            <div className="animate-pulse delay-800 duration-1000">n</div>
            <div className="animate-pulse delay-900 duration-1000">e</div>
        </div>
    );
}
