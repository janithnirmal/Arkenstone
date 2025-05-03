import PageLayout from '../layouts/page-layout';
import { Head } from '@inertiajs/react';
export default function Home() {
    return (
        <PageLayout>
            <Head title="Home" />
            <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">Home</h1>
            </div>
        </PageLayout>
    );
}
