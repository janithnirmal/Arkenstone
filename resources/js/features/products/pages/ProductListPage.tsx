import { Product } from '@/core/types';
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/product-card';
import { ProductCardProps } from '../components/product-card/types';
import { productService } from '../services/productService';

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getProducts();
                setProducts(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Empty array means this runs once on mount

    if (loading) return <div className="p-10 text-center">Loading Products...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-6 text-3xl font-bold">Our Products</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products?.map((product) => (
                    <ProductCard key={product.id} product={product as unknown as ProductCardProps} />
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;
