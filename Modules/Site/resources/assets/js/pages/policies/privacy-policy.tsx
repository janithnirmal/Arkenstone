import { Head } from '@inertiajs/react';
import PolicyRenderer from '../../components/renderer/policy';
import PageLayout from '../../layouts/page-layout';
import privacyPolicyData from './data/privacy-policy';

export default function PrivacyPolicy() {
    return (
        <PageLayout>
            <Head title="Privacy Policy" />
            <PolicyRenderer policyData={privacyPolicyData} />
        </PageLayout>
    );
}
