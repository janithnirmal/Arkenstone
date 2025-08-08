import PageLayout from '@/core/layouts/page-layout';
import privacyPolicyData from './data/privacy-policy';
import Policy from './policy';

export default function PrivacyPolicy() {
    return (
        <PageLayout>
            <Policy policyData={privacyPolicyData} />
        </PageLayout>
    );
}
