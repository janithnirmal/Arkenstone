import PageLayout from '../layouts/page-layout';
import { Head } from '@inertiajs/react';

import Hero from './home/Hero';
import MenCollection from './home/MenCollection';
import NewArrival from './home/NewArrival';
import WomenCollection from './home/WomenCollection';

export default function Home() {
    return (
        <PageLayout>
            <Head title="Home" />
            <Hero />
            <NewArrival />
            <MenCollection />
            <WomenCollection />
        </PageLayout>
    );
}
