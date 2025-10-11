import DataManager from '@core/components/data-manager/data-manager';
import PageLayout from '@site/layouts/page-layout';
import { productsConfig } from './test/example-data-manager';

export default function Test() {
    return (
        <PageLayout>
            <section className="container mx-auto py-5">
                {/* <DynamicFormGenerator options={userRegistrationFormOptions} /> */}
                <DataManager config={productsConfig} />
            </section>
        </PageLayout>
    );
}
