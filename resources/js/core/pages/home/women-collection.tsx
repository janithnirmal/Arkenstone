import ProductList from '../common/product-list';

export default function WomenCollection() {
    return (
        <section className="bg-muted/50 h-full w-full py-5">
            <div className="container mx-auto min-h-120 w-full">
                <h1 className="text-center text-3xl font-bold">Womens Collection</h1>
                <p className="text-lg text-muted-foreground mt-1 text-center">Elegant and cozy ladies fashion!</p>
                <ProductList options={{ category_ids: [2, 3, 4], search: '' }} />
            </div>
        </section>
    );
}
