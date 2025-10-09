import { useProductsState } from '@product/states/use-product-state';

const Filter = () => {
    const { setFilters } = useProductsState();

    const handleCategoryChange = (e: any) => setFilters({ categories: e.target.value > 0 ? [e.target.value] : [] });

    return (
        <div>
            <select onChange={handleCategoryChange}>
                <option value={0}>All</option>
                <option value={1}>Shoes</option>
                <option value={2}>Clothing</option>
            </select>
        </div>
    );
};

export default Filter;
