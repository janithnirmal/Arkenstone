// resources/js/modules/products/pages/ProductDetailPage.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product, ProductImage, ProductVariant } from '../types';
import ImageGallery from '../components/catalog/ImageGallery';
// We'll re-use the VariantSelector here, but it may need adjustment based on real API data
// import VariantSelector from '../components/catalog/VariantSelector';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for user selections
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [mainImage, setMainImage] = useState<ProductImage | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await productService.getProduct(parseInt(id, 10));
                setProduct(data);

                // --- Set initial state after data is fetched ---
                // Set the first variant as the default selection
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
                // Set the primary image as the default main image
                const primary = data.images.find(img => img.is_primary) || data.images[0];
                setMainImage(primary);

            } catch (err) {
                setError("Product not found or failed to load.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);
    
    // Determine the price and stock to display based on the selected variant or base product
    const displayPrice = selectedVariant?.price || product?.price;
    const displayStock = selectedVariant?.stock ?? product?.stock;
    const isOutOfStock = displayStock === 0;

    if (isLoading) return <div className="p-10 text-center">Loading product...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="bg-white">
            <div className="pt-6">
                <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                    
                    {/* Image gallery */}
                    <div className="lg:col-span-1 lg:border-r lg:border-gray-200 lg:pr-8">
                        <ImageGallery
                            images={product.images}
                            productName={product.name}
                            selectedImage={mainImage}
                            onSelectImage={setMainImage}
                        />
                    </div>

                    {/* Product info */}
                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-gray-900 mt-4">${displayPrice?.toFixed(2)}</p>

                        {/* Promotions */}
                        {product.promotions && product.promotions.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {product.promotions.map(promo => (
                                    <div key={promo.id} className="bg-red-100 text-red-700 p-3 rounded-lg">
                                        <p className="font-bold">{promo.title}: {promo.discount_percent}% off!</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6 text-base text-gray-900" dangerouslySetInnerHTML={{ __html: product.description }} />
                        </div>

                        <div className="mt-10">
                            {/* Variant Selection would go here. For simplicity, we'll list them */}
                            {product.variants.length > 0 && (
                                <div className="space-y-4">
                                     <h3 className="text-sm font-medium text-gray-900">Options</h3>
                                     <div className="flex flex-wrap gap-2">
                                        {product.variants.map(variant => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`px-4 py-2 text-sm border rounded-md transition-colors ${selectedVariant?.id === variant.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100'}`}
                                            >
                                                {variant.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stock Status and Add to Cart */}
                        <div className="mt-10">
                             <p className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                            </p>
                             <button
                                type="submit"
                                disabled={isOutOfStock}
                                className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 py-3 px-8 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Add to bag
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;