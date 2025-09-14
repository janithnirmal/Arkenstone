import { AnalyticsTest } from '@/modules/analytics/page/analytics-test';
import PageLayout from '@@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';

export default function Analytics() {
    return (
        <PageLayout>
            <Head title="Analytics" />
            <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">Analytics</h1>
            </div>

            <section className="container mx-auto py-10">
                <AnalyticsTest />
            </section>
        </PageLayout>
    );
}
