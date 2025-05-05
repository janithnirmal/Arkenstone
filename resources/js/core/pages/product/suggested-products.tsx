import { useState } from 'react';
import ProductCarousal from '../common/product-carousal';

export default function SuggestedProducts({ search, current_product_id }: { search: string; current_product_id: number }) {
    const [hasProducts, setHasProducts] = useState(false);

    return (
        <section className={`bg-secondary/30 h-full w-full py-5 ${hasProducts ? 'block' : 'hidden'}`}>
            <div className="container mx-auto min-h-120 w-full">
                <h1 className="text-center text-3xl font-bold">Suggested Products</h1>
                <p className="text-lg text-muted-foreground mt-1 text-center">Similar products we recommend for you!</p>
                <ProductCarousal options={{ search, current_product_id }} setHasProducts={setHasProducts} />
            </div>
        </section>
    );
}
