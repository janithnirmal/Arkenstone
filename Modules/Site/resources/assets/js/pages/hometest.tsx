import { Head } from '@inertiajs/react';
import PageLayout from '@site/layouts/page-layout';
import HeroSection from './home/hero-section';

export default function Home() {
    return (
        <PageLayout>
            <Head title="Home" />
            <HeroSection />
        </PageLayout>
    );
}
