import ProductCarousal from '../common/product-carousal';

export default function NewArrival() {
    return (
        <section className="h-full w-full py-5">
            <div className="container mx-auto w-full min-h-120">
                <h1 className="text-3xl font-bold text-center">New Arrivals</h1>
                <p className="text-lg text-muted-foreground mt-1 text-center">Check out our latest products!</p>
                <ProductCarousal options={{ category_ids: [1, 2, 3], search: '' }} />
            </div>
        </section>
    );
}
