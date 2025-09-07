import { Head } from '@inertiajs/react';
import PageLayout from '../layouts/page-layout';
import ContactForm from './contact/contact-form';

export default function Contact() {
    return (
        <PageLayout>
            <Head title="Contact" />
            <div className="flex min-h-screen flex-col items-center justify-center">
                <div className="w-full max-w-md py-10">
                    <ContactForm title="Contact Us" description="Send us a message and we'll get back to you as soon as possible." />
                </div>
            </div>
        </PageLayout>
    );
}
