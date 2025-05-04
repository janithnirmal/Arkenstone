import { Button } from '@/components/ui/button';
import ProductCard from '@/core/components/shop/product-card/simple-card';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { FilterContext } from '@/core/layouts/shop/shop-sidebar-filter-layout';
import { SearchContext } from '@/core/layouts/shop/shop-sidebar-filter-layout';
import { apiGet } from '@/core/lib/api';
import { Product } from '@/core/types';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

export default function Listing() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(9);

    const [isLoading, setIsLoading] = useState(false);

    const searchContext = useContext(SearchContext);

    const isMobile = useIsMobile();

    const [showPageInput, setShowPageInput] = useState(false);
    const [pageInput, setPageInput] = useState('');

    useEffect(() => {
        setIsLoading(true);
        apiGet('/product', {
            data: {
                category_ids: searchContext?.filterOptions.categories?.map((category) => category.id),
                search: searchContext?.search,
            },
        }).then((res) => {
            setProducts(res);
            setIsLoading(false);
        });
    }, [searchContext]);

    useEffect(() => {
        setFilteredProducts(products.slice((page - 1) * perPage, page * perPage));
    }, [page, products, perPage]);

    const totalPages = Math.ceil(products.length / perPage);

    const handlePageJump = () => {
        const pageNum = parseInt(pageInput);
        if (pageNum > 0 && pageNum <= totalPages) {
            setPage(pageNum);
            setShowPageInput(false);
            setPageInput('');
        }
    };

    const renderPagination = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 3;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (page > 3) {
                pages.push('...');
            }
            const startPage = Math.max(2, page - 1);
            const endPage = Math.min(totalPages - 1, page + 1);
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            if (page < totalPages - 2) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return (
            <div className="grid grid-cols-4 grid-rows-2 items-center gap-1 lg:flex lg:flex-row">
                <div className="col-span-2 row-span-2 flex items-center gap-1">
                    <Button variant="outline" size={isMobile ? 'sm' : 'default'} onClick={() => setPage(1)} disabled={page === 1}>
                        {isMobile ? <ChevronsLeft /> : 'First'}
                    </Button>
                    <Button variant="outline" size={isMobile ? 'sm' : 'default'} onClick={() => setPage(page - 1)} disabled={page === 1}>
                        {isMobile ? <ChevronLeft /> : 'Previous'}
                    </Button>
                </div>
                <div className="col-span-4 row-start-1 row-end-2 flex items-center justify-center gap-1">
                    {pages.map((p, index) =>
                        p === '...' ? (
                            showPageInput ? (
                                <input
                                    key={index}
                                    type="number"
                                    value={pageInput}
                                    onChange={(e) => setPageInput(e.target.value)}
                                    onBlur={handlePageJump}
                                    onKeyPress={(e) => e.key === 'Enter' && handlePageJump()}
                                    className={`rounded border px-2 py-1 ${isMobile ? 'w-8' : 'w-10'}`}
                                    autoFocus
                                />
                            ) : (
                                <Button size={isMobile ? 'sm' : 'default'} key={index} variant="outline" onClick={() => setShowPageInput(true)}>
                                    ...
                                </Button>
                            )
                        ) : (
                            <Button
                                size={isMobile ? 'sm' : 'default'}
                                key={index}
                                variant={page === p ? 'default' : 'outline'}
                                onClick={() => setPage(p as number)}
                            >
                                {p}
                            </Button>
                        ),
                    )}
                </div>
                <div className="col-span-2 row-span-2 flex items-center gap-1">
                    <Button size={isMobile ? 'sm' : 'default'} variant="outline" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                        {isMobile ? <ChevronRight /> : 'Next'}
                    </Button>
                    <Button size={isMobile ? 'sm' : 'default'} variant="outline" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                        {isMobile ? <ChevronsRight /> : 'Last'}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="relative mb-4 flex w-full flex-wrap justify-center gap-6 overflow-y-auto p-3 py-5">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} data={product} />
            ))}
            {isLoading && (
                <div className="absolute mt-40 flex w-full flex-col items-center justify-center gap-2">
                    <Loader2 className="h-16 w-16 animate-spin" />
                    <p>Loading..</p>
                </div>
            )}
            {filteredProducts.length === 0 && !isLoading && <div className="flex w-full justify-center gap-1">No products found</div>}
            {filteredProducts.length > 0 && <div className="flex w-full justify-center gap-1">{renderPagination()}</div>}
        </div>
    );
}
