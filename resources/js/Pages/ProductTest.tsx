import {
    CatalogContentLayout,
    Search,
    Filters,
    Listing,
    ListingControl,
    Pagination,
    ProductCard,
    Product,
    productService,
    Arkenstone,
} from "arkenstone-ui";
import TestLayout, { TestLayoutConfig } from "../Layouts/test-layout";
import { useEffect, useState } from "react";

const FILTER_CONFIG = [
    {
        id: "categories",
        title: "Categories",
        type: "tree",
        options: [
            {
                label: "Dresses",
                value: "dresses",
                children: [
                    { label: "Short Dresses", value: "short-dresses" },
                    { label: "Midi Dresses", value: "midi-dresses" },
                    { label: "Maxi Dresses", value: "maxi-dresses" },
                ],
            },
            {
                label: "Tops",
                value: "tops",
                children: [
                    { label: "T-shirts", value: "tshirts" },
                    { label: "Knitwear", value: "knitwear" },
                ],
            },
        ],
    },
    {
        id: "sizes",
        title: "Sizes",
        type: "checkbox",
        options: [
            { label: "XS", value: "xs" },
            { label: "S", value: "s" },
            { label: "M", value: "m" },
            { label: "L", value: "l" },
            { label: "XL", value: "xl" },
        ],
    },
    {
        id: "sizes-list",
        title: "Sizes-list",
        type: "checkbox-list",
        options: [
            { label: "XS", value: "xs" },
            { label: "S", value: "s" },
            { label: "M", value: "m" },
            { label: "L", value: "l" },
            { label: "XL", value: "xl" },
        ],
        itemsShown: 3,
    },
    {
        id: "price_custom",
        title: "Price",
        type: "price_custom",
        options: [
            { label: "Price", value: "price", min: 0, max: 2000, step: 10 },
        ],
    },
];

export default function LeadGenerationTest() {
    const config: TestLayoutConfig = {
        title: "Lead Generation Test",
        compName: "Discount Badge",
        compDescription: "A badge that displays a discount amount.",
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const filters = productService.useStore((state) => state.filters) || {};
    const storeList = productService.useStore((s) => s.list || []);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [sortBy, setSortBy] = useState("price");
    const [viewMode, setViewMode] = useState<"grid" | "list" | "gallery">(
        "grid"
    );
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    useEffect(() => {
        setProducts(storeList);
        setTotal(Array.isArray(storeList) ? storeList.length : 0);
    }, [storeList]);

    const fetchProducts = async () => {
        setLoading(true);

        try {
            // await the promise returned by getAll so `response` is the resolved value (array | ListResponse | null)
            const response = (await productService.getAll(
                {
                    search: searchQuery,
                    filters: filters,
                    page: page,
                    per_page: pageSize,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                },
                { displayError: true, displaySuccess: true }
            )) as Product[] | null;

            if (!response) {
                setProducts([]);
                setTotal(0);
            } else if (Array.isArray(response)) {
                // service returned a plain array of products
                setProducts(response);
                setTotal(response.length);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    // initial fetch
    useEffect(() => {
        fetchProducts();
    }, [searchQuery, filters, page, pageSize, sortBy, sortOrder]);

    const renderProductList = () => {
        if (loading) {
            return (
                <div className="p-10 text-center text-gray-500">Loading...</div>
            );
        }

        if (!products || products.length === 0) {
            return <div className="p-10 text-center">No products found.</div>;
        }

        if (viewMode === "gallery") {
            // Gallery view: large images
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product}  />
                    ))}
                </div>
            );
        } else if (viewMode === "list") {
            // List view: detailed list
            return (
                <div className="flex flex-col gap-4">
                    {products.map((product: any) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            layout="detailed"
                        />
                    ))}
                </div>
            );
        } else {
            // Grid view: compact grid
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            );
        }
    };

    // basic derived UI (keeps a small search area)
    const top = (
        <div className="w-full max-w-4xl mx-auto mb-4">
            <Search
                placeholder="Search products..."
                value={searchQuery}
                onChange={(q) => {
                    setSearchQuery(q);
                    setPage(1);
                }}
                debounce={300}
                buttonType="icon"
            />
        </div>
    );

    const left = (
        <div className="bg-white rounded-lg shadow-sm p-3 text-gray-500">
            <div className="p-2 border-b font-semibold">Filters</div>
            <div className="p-3">
                <Filters
                    filters={FILTER_CONFIG}
                    value={filters}
                    onChange={(next) => {
                        productService.useStore.setState({ filters: next });
                        setPage(1);
                    }}
                />
            </div>
        </div>
    );

    const controls = (
        <div className="h-24">
            <ListingControl
                sortProps={{
                    sortOrder: sortOrder,
                    sortBy: sortBy,
                    onSortChange: (order) => {
                        setSortOrder(order);
                        setPage(1); // Reset to first page
                    },
                    onSortByChange: (by) => {
                        setSortBy(by);
                        setPage(1); // Reset to first page
                    },
                }}
                viewModeProps={{
                    mode: viewMode,
                    onChange: (m) => setViewMode(m),
                    availableModes: ["grid", "list", "gallery"],
                }}
            />
        </div>
    );

    const pagination = (
        <Pagination
            page={page}
            total={total}
            pageSize={pageSize}
            onChange={(newPage) => setPage(newPage)}
        />
    );

    return (
        <Arkenstone config={{
            api: {
                url: "/api/v1"
            },
            aclConfig: {
                mode: "local",
            }
        }}>
            <TestLayout config={config}>
                <div className="p-4">
                    <div className="min-h-screen p-6">
                        <CatalogContentLayout
                            top={top}
                            left={left}
                            listings={
                                <Listing
                                    controls={controls}
                                    list={renderProductList()}
                                    pagination={pagination}
                                />
                            }
                        />
                    </div>
                </div>
            </TestLayout>
        </Arkenstone>
    );
}
