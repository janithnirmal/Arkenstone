import Config from '@core/config';
import { Head } from '@inertiajs/react';
import PageLayout from '@site/layouts/page-layout';

export default function Home() {
    return (
        <PageLayout>
            <Head title="Home" />
            <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
                <h1 className="mb-4 text-4xl font-bold">🏡 Welcome to The Home of{Config.appName}</h1>
                <p className="text-muted-foreground mb-8 max-w-2xl text-lg">This is the home page. You can customize it as you like.</p>
            </div>
        </PageLayout>
    );
}
