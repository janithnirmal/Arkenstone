import { Head } from '@inertiajs/react';
import PageLayout from '@site/layouts/page-layout';

export default function About() {
    return (
        <PageLayout>
            <Head title="About" />
            <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
                <h1 className="mb-4 text-4xl font-bold">About Us</h1>
                <p className="text-muted-foreground mb-8 max-w-2xl text-lg">🫱🏾‍🫲🏻 This is the about page. Describe about your business.</p>
            </div>
        </PageLayout>
    );
}
