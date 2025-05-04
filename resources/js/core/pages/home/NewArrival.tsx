import ProductCarousal from '../common/product-carousal';

export default function NewArrival() {
    return (
        <section className="h-full w-full py-5">
            <div className="container mx-auto w-full min-h-120">
                <h1 className="text-2xl font-bold text-center">Latest Products</h1>
                <ProductCarousal options={{ category_ids: [1, 2, 3], search: '' }} />
            </div>
        </section>
    );
}
