import PageLayout from '@core/layouts/page-layout';
import TermsAndConditionsData from './data/terms-and-conditions';
import Policy from './policy';
import { Head } from '@inertiajs/react';
export default function TermsAndConditions() {
    return (
        <PageLayout>
            <Head title="Terms and Conditions" />
            <Policy policyData={TermsAndConditionsData} />
        </PageLayout>
    );
}
