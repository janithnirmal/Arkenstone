import { Button } from '@/components/ui/button';
import ProductCard from '@/core/components/shop/product-card/simple-card';
import { useIsMobile } from '@/core/hooks/use-mobile';
import { Product } from '@/core/types';
import { ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Listing() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(9);

    const isMobile = useIsMobile();

    const [showPageInput, setShowPageInput] = useState(false);
    const [pageInput, setPageInput] = useState('');

    useEffect(() => {
        setProducts([
            { id: 1, name: 'Product 1', price: 100 },
            { id: 2, name: 'Product 2', price: 200 },
            { id: 3, name: 'Product 3', price: 300 },
            { id: 4, name: 'Product 4', price: 400 },
            { id: 5, name: 'Product 5', price: 500 },
            { id: 6, name: 'Product 6', price: 600 },
            { id: 7, name: 'Product 7', price: 700 },
            { id: 8, name: 'Product 8', price: 800 },
            { id: 9, name: 'Product 9', price: 900 },
            { id: 10, name: 'Product 10', price: 1000 },
            { id: 11, name: 'Product 11', price: 1100 },
            { id: 12, name: 'Product 12', price: 1200 },
            { id: 13, name: 'Product 13', price: 1300 },
            { id: 14, name: 'Product 14', price: 1400 },
            { id: 15, name: 'Product 15', price: 1500 },
            { id: 16, name: 'Product 16', price: 1600 },
            { id: 17, name: 'Product 17', price: 1700 },
        ]);
    }, []);

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
                <div className="col-span-4 row-start-1 row-end-2 flex items-center gap-1 justify-center">
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
        <div className="mb-4 flex w-full flex-wrap justify-center gap-6 overflow-y-auto p-3 py-5">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} data={product} />
            ))}
            {filteredProducts.length > 0 && <div className="flex w-full justify-center gap-1">{renderPagination()}</div>}
        </div>
    );
}
