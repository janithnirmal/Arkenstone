import { Head } from '@inertiajs/react';
import PageLayout from '@site/layouts/page-layout';

export default function Irushi() {
    return (
        <PageLayout>
            <Head title="Irushi" />
            <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
                <h1 className="mb-4 text-4xl font-bold">🏡 Welcome to The Home Irushi</h1>
            </div>
        </PageLayout>
    );
}
