import { Head } from '@inertiajs/react';
import PageLayout from '@site/layouts/page-layout';

interface ErrorPageProps {
    status: 403 | 404 | 500 | 503;
}

export default function ErrorPage({ status }: ErrorPageProps) {
    const title = {
        503: 'Service Unavailable',
        500: 'Server Error',
        404: 'Page Not Found',
        403: 'Forbidden',
    }[status];

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status];

    return (
        <PageLayout>
            <Head title="Home" />
            <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
                <span className="mb-3 text-7xl">⚠️</span>
                <span className="text-7xl font-black">{status}</span>
                <h1 className="text-4xl">{title}</h1>
                <p className="text-muted-foreground mb-8 max-w-2xl text-lg">{description}</p>
            </div>
        </PageLayout>
    );
}
