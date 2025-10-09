import { useProductsState } from '@product/states/use-product-state';
import SimpleProductCard from '../product-card/simple-product-card';

const Catalogue = () => {
    const { products, loading } = useProductsState();

    if (loading) return <p>Loading...</p>;
    return (
        <div className="bg bg-secondary mt-4 flex flex-wrap justify-around gap-2 rounded-2xl p-6">
            {products?.data.map((p) => <SimpleProductCard key={p.id} data={p} />)}
        </div>
    );
};

export default Catalogue;
