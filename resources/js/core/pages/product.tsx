import Button from '@/components/custom/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PageLayout from '../layouts/page-layout';
import { ProductImage, Product as ProductType } from '../types';
import ProductSelector from './product/product-selector';

export default function Product() {
    const { product }: { product: ProductType } = usePage<{ product: ProductType }>().props;

    const [selectedImage, setSelectedImage] = useState<ProductImage>(
        product.images?.[0] ?? { id: 0, path: 'https://placehold.co/800?text=No+Images+found&font=robotoa', product_id: 0 },
    );
    return (
        <PageLayout>
            <Head title="Product" />
            <div className="container mx-auto flex flex-col gap-5 p-4">
                <SingleProductBreadcrumb product={product} />
                <div className="flex h-screen flex-col gap-5 lg:flex-row">
                    <div className="lg:hidden">
                        <h2 className="text-2xl font-bold lg:text-4xl">{product.name}</h2>
                        <span className="text-sm text-gray-500">{product.category?.name}</span>
                    </div>
                    <div className="relative h-[80vh] flex-1 overflow-hidden rounded-lg">
                        <img
                            src={selectedImage.path}
                            className="animate-in fade-in-0 absolute h-full w-full bg-cover bg-center object-cover duration-1000 hover:scale-120"
                        ></img>
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <div className="hidden lg:block">
                                <h2 className="text-2xl font-bold lg:text-4xl">{product.name}</h2>
                                <span className="text-sm text-gray-500">{product.category?.name}</span>
                            </div>

                            <hr />

                            <div className="flex w-full gap-3 overflow-x-auto">
                                {product.images?.map((image, index) => {
                                    if (image.id !== selectedImage.id) {
                                        return (
                                            <img
                                                key={image.id}
                                                src={image.path}
                                                className="h-15 w-15 rounded-md bg-cover bg-center object-cover"
                                                onClick={() => setSelectedImage(image)}
                                            ></img>
                                        );
                                    }
                                })}
                            </div>

                            <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>

                        <ProductSelector product={product} />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

export function SingleProductBreadcrumb({ product }: { product: ProductType }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink className="truncate" href={`/shop/${product.category?.slug}`}>
                        {product.category?.name}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink className="truncate" href={`/product/${product.slug}`}>
                        {product.name}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
