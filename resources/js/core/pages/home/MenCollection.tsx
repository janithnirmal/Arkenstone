import ProductList from "../common/product-list";


export default function MenCollection() {
    return (
        <section className="h-full w-full py-5 bg-muted">
            <div className="container mx-auto w-full min-h-120">
                <h1 className="text-2xl font-bold text-center">Mens</h1>
                <ProductList options={{ category_ids: [1, 2, 3], search: '' }} />
            </div>
        </section>
    );
}
