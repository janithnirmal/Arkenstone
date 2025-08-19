import React, { useEffect, useState } from 'react';
import ProductCard from '../components/product-card';
import { productService } from '../services/productService';
import { Product } from '../types';
import { CatalogResult } from '../types/http.types';

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data: CatalogResult = await productService.getProducts();
                setProducts(data.data);
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
                <ProductCard data={products} />
        </div>
    );
};

export default ProductListPage;
