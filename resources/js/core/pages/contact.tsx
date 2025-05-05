import { Head } from '@inertiajs/react';
import PageLayout from '../layouts/page-layout';

export default function Contact() {
    return (
        <PageLayout>
            <Head title="Contact" />
            <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">Contact</h1>
                <p className="text-muted-foreground text-lg">Update Your Contact Page Here</p>
            </div>
        </PageLayout>
    );
}
