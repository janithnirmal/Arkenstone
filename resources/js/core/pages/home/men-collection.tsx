import ProductList from '../common/product-list';

export default function MenCollection() {
    return (
        <section className="bg-muted h-full w-full py-5">
            <div className="container mx-auto min-h-120 w-full">
                <h1 className="text-center text-3xl font-bold">Mens Collection</h1>
                <p className="text-lg text-muted-foreground mt-1 text-center">Stylish and comfortable men's clothing!</p>
                <ProductList options={{ category_ids: [1, 2, 3], search: '' }} />
            </div>
        </section>
    );
}
