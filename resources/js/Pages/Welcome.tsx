// pages/ProductListingPage.tsx
import { Breadcrumbs } from "arkenstone-ui";
import { Head } from "@inertiajs/react";

export default function Welcome() {

    return (
        <>
            <Head title="Products" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                title: "Home",
                                href: "/",
                            },
                            {
                                title: "Products",
                                href: "/products",
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
}