import ProductList from "../common/product-list";


export default function WomenCollection() {
    return (
        <section className="h-full w-full py-5 bg-muted/50">
            <div className="container mx-auto w-full min-h-120">
                <h1 className="text-2xl font-bold text-center">Womens</h1>
                <ProductList options={{ category_ids: [2, 3, 4], search: '' }} />
            </div>
        </section>
    );
}
