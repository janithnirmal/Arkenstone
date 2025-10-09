// components/CatalogManager/CatalogManager.jsx
import { useProductsState } from '@product/states/use-product-state';
import { useEffect } from 'react';
import Catalogue from './catalogue/catalogue';
import Filter from './filter/filter';
import Search from './search/search';

const CatalogManager = () => {
    const { fetchData, filters } = useProductsState();

    useEffect(() => {
        fetchData();
    }, [filters]);

    return (
        <div>
            <Search />
            <Filter />
            <Catalogue />
        </div>
    );
};

export default CatalogManager;
