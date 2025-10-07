import { Head } from '@inertiajs/react';
import PageLayout from '../../layouts/page-layout';
import PolicyRenderer from '../../components/renderer/policy';
import ReturnPolicyData from './data/return-policy';

export default function ReturnPolicy() {
    return (
        <PageLayout>
            <Head title="Return Policy" />
            <PolicyRenderer policyData={ReturnPolicyData} />
        </PageLayout>
    );
}
