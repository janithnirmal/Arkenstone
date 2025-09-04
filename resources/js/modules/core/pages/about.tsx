import { Head } from '@inertiajs/react';
import PageLayout from '../layouts/page-layout';

export default function About() {
    return (
        <PageLayout>
            <Head title="About" />
            <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">About</h1>
                <p className="text-lg text-muted-foreground">Update Your About Page Here</p>
            </div>
        </PageLayout>
    );
}
