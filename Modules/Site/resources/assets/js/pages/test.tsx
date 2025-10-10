import DynamicFormGenerator from '@site/components/form-generator/dynamic-form-generator';
import PageLayout from '@site/layouts/page-layout';
import userRegistrationFormOptions from './forms/example-form';

export default function Test() {
    return (
        <PageLayout>
            <section className="py-5">
                <DynamicFormGenerator options={userRegistrationFormOptions} />
            </section>
        </PageLayout>
    );
}
