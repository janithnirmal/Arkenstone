import PageLayout from '@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';
import ReturnPolicyData from './data/return-policy';
import Policy from './policy';

export default function ReturnPolicy() {
    return (
        <PageLayout>
            <Head title="Return Policy" />
            <Policy policyData={ReturnPolicyData} />
        </PageLayout>
    );
}
