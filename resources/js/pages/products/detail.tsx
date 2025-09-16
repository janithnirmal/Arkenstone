import ProductDetailPage from '@/modules/products/pages/ProductDetailPage';
import PageLayout from '@@/core/layouts/page-layout';
import { Head } from '@inertiajs/react';

export default function ProductDetail() {
    return (
        <PageLayout>
            {/* The Head title can be dynamically set from props later */}
            <Head title="Product Details" />
            <ProductDetailPage />
        </PageLayout>
    );
}