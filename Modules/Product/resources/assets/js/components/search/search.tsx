import { useProductsState } from '@product/states/use-product-state';

const Search = () => {
    const { setFilters } = useProductsState();

    return (
        <input
            type="text"
            placeholder="Search..."
            onChange={(e) => {
                if (e.target.value.length >= 3 || e.target.value.length === 0) {
                    setFilters({ name: e.target.value });
                }
            }}
        />
    );
};

export default Search;
