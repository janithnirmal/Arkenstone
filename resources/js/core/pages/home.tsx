import { Head } from '@inertiajs/react';
import PageLayout from '../layouts/page-layout';

import HeroSection from './home/hero-section';
import MenCollection from './home/men-collection';
import NewArrival from './home/new-arrival';
import WomenCollection from './home/women-collection';

export default function Home() {
    return (
        <PageLayout>
            <Head title="Home" />
            <HeroSection />
            <NewArrival />
            <MenCollection />
            <WomenCollection />
        </PageLayout>
    );
}
