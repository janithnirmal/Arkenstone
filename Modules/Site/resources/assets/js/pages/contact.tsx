import { Head } from '@inertiajs/react';
import PageLayout from '@site/layouts/page-layout';

export default function About() {
    return (
        <PageLayout>
            <Head title="About" />
            <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
                <h1 className="mb-4 text-4xl font-bold">Contact</h1>
                <p className="text-muted-foreground mb-8 max-w-2xl text-lg">☎️ update your contact details!</p>
            </div>
        </PageLayout>
    );
}
