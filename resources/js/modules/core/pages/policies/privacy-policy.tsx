import PageLayout from '@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';
import privacyPolicyData from './data/privacy-policy';
import Policy from './policy';

export default function PrivacyPolicy() {
    return (
        <PageLayout>
            <Head title="Privacy Policy" />
            <Policy policyData={privacyPolicyData} />
        </PageLayout>
    );
}
