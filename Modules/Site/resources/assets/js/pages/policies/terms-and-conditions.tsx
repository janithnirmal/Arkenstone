import { Head } from '@inertiajs/react';
import PolicyRenderer from '../../components/renderer/policy';
import PageLayout from '../../layouts/page-layout';
import TermsAndConditionsData from './data/terms-and-conditions';

export default function TermsAndConditions() {
    return (
        <PageLayout>
            <Head title="Terms and Conditions" />
            <PolicyRenderer policyData={TermsAndConditionsData} />
        </PageLayout>
    );
}
