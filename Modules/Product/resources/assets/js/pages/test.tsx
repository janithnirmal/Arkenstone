import { useEffect, useState } from 'react';
import SimpleProductCard from '../components/product-card/simple-product-card';
import { productService } from '../services/product-service';
import { Product } from '../types';

export default function Test() {
    const [products, setProducts] = useState<Product[]>();

    useEffect(() => {
        productService
            .getProducts({ page: 1, limit: 10 })
            .then((response) => {
                setProducts(response.data);
                console.log('Products:', response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <div className="container mx-auto bg-teal-800 px-10 py-3 text-center text-2xl font-bold">
            <h1>Testing One</h1>
            <div className="flex flex-wrap items-center justify-center gap-4">{products?.map((product) => <SimpleProductCard data={product} />)}</div>
        </div>
    );
}
