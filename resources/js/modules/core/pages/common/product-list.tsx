import ProductCard from '@/core/components/shop/product-card/simple-card';
import { apiGet } from '@/core/lib/api';
import { Product } from '@/core/types';
import { useEffect, useState } from 'react';

type ProductListOptions = {
    category_id?: number;
    category_ids?: number[];
    search?: string;
};

export default function ProductList({ options }: { options: ProductListOptions }) {
    const [products, setProducts] = useState<Product[]>([]);

    const data = {
        category_id: options.category_id,
        category_ids: options.category_ids ?? [],
        search: options.search ?? '',
    };

    useEffect(() => {
        apiGet('/product', {
            data,
        }).then((res) => {
            setProducts(res);
        });
    }, []);

    return (
        <div className="h-max w-full p-5">
            <div className="flex flex-wrap gap-8 justify-center">
                {products.map((product) => (
                    <ProductCard key={product.id} data={product} />
                ))}
            </div>
        </div>
    );
}
