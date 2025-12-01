// pages/ProductListingPage.tsx
import {
    AddToCart,
    Breadcrumbs,
    ListingControl,
    Pagination,
    ProductCard,
    SortBar,
    ViewModeSwitcherProps,
    ProductImage,
    ProductCardLayout,
    ProductImageLayout,
    WishlistButton,
    DiscountBadge,
    DiscountType,
    SortBarProps,
    BrandTitle,
    CategoriesBadgeList,
    PriceCard,
    ViewDetailsButton,
} from "arkenstone-ui";
// import Filter from "arkenstone-ui";
import { Head } from "@inertiajs/react";
// import { on } from "events";

const exampleProduct = {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description:
        "Premium over-ear headphones with active noise cancellation and 30-hour battery life",
    price: 149.99,
    discount_type: "percentage",
    discount_value: 15,
    sale_price: 127.49,
    has_discount: true,
    sku: "WBH-001",
    quantity: 45,
    is_active: true,
    brand: {
        id: 1,
        name: "SoundWave",
        slug: "soundwave",
        description: null,
        logo: "https://picsum.photos/seed/brand1/200/100",
        is_active: true,
        product_count: 24,
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-11-10T14:20:00.000Z",
    },
    categories: [
        {
            id: 1,
            parent_id: null,
            name: "Electronics",
            slug: "electronics",
            description: null,
            children: [],
            products_count: 120,
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
        },
        {
            id: 5,
            parent_id: null,
            name: "Audio",
            slug: "audio",
            description: null,
            children: [],
            products_count: 42,
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
        },
    ],
    taxonomies: [
        {
            id: 1,
            taxonomy_type_id: 1,
            parent_id: null,
            name: "Electronics",
            slug: "electronics",
            description: "Electronic products and devices",
            sort_order: 0,
            meta: { featured: true },
            is_active: true,
            type: {
                id: 1,
                name: "Categories",
                slug: "categories",
                description: "Product categories",
                is_active: true,
                taxonomies_count: 0,
                taxonomies: [],
                created_at: "2024-01-01T00:00:00.000Z",
                updated_at: "2024-01-01T00:00:00.000Z",
            },
            parent: null,
            children: [],
            products_count: 120,
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
        },
        {
            id: 10,
            taxonomy_type_id: 2,
            parent_id: null,
            name: "Premium",
            slug: "premium",
            description: "Premium quality products",
            sort_order: 1,
            meta: { color: "gold" },
            is_active: true,
            type: {
                id: 2,
                name: "Tags",
                slug: "tags",
                description: "Product tags",
                is_active: true,
                taxonomies_count: 0,
                taxonomies: [],
                created_at: "2024-01-01T00:00:00.000Z",
                updated_at: "2024-01-01T00:00:00.000Z",
            },
            parent: null,
            children: [],
            products_count: 10,
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
        },
    ],
    images: [
        {
            id: 101,
            product_id: 1,
            image_url: "https://picsum.photos/seed/product1/400/400",
            alt_text: "Wireless headphones front view",
            is_primary: true,
            sort_order: 0,
        },
        {
            id: 102,
            product_id: 1,
            image_url: "https://picsum.photos/seed/product1b/400/400",
            alt_text: "Wireless headphones side view",
            is_primary: false,
            sort_order: 1,
        },
    ],
    primary_image: {
        id: 101,
        product_id: 1,
        image_url: "https://picsum.photos/seed/product1/400/400",
        alt_text: "Wireless headphones front view",
        is_primary: true,
        sort_order: 0,
    },
    created_at: "2024-01-15T10:30:00.000Z",
    updated_at: "2024-11-10T14:20:00.000Z",
};

export default function Welcome() {
    const sortProps: SortBarProps = {
        sortOrder: "asc",
        sortBy: "price",
        sortOptions: [
            { label: "Price: Low to High", value: "price_asc" },
            { label: "Price: High to Low", value: "price_desc" },
            { label: "Newest Arrivals", value: "newest" },
        ],
        onSortChange: (value: string) => {
            console.log("Selected sort option:", value);
        },
        onSortByChange: (sortBy) => {
            console.log("Selected sort order:", sortBy);
        },
    };

    const viewModeProps: ViewModeSwitcherProps = {
        mode: "card",
        onChange: (mode) => {
            console.log("Selected view mode:", mode);
        },
    };

    const product = {
        id: 1,
        name: "Sample Product",
        slug: "sample-product",
        description: "This is a sample product.",
        price: 99.99,
        discount_type: "percentage",
        discount_value: 20,
        sale_price: 79.99,
        has_discount: true,
        sku: "SP-001",
        quantity: 100,
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
        brand: null,
        categories: [
            {
                id: 1,
                parent_id: null,
                name: "Sample Category",
                slug: "sample-category",
                description: "Description for sample category.",
                children: [],
                products_count: 0,
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-02T00:00:00Z",
            },
        ],
        taxonomies: null,
        images: [
            {
                id: 1,
                product_id: 1,
                image_url:
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
                alt_text: "Sample Product Image",
                is_primary: true,
                sort_order: 1,
            },
        ],
        primary_image: null,
    };

    const topPlaceholder = (
        <div>
            <WishlistButton />
            <DiscountBadge
                discount={product.discount_value}
                discountType={product.discount_type as DiscountType}
                currency="USD"
            />
        </div>
    );

    const bottomPlaceholder = <div className="bg-gray-200 w-full h-12"></div>;

    return (
        <>
            <Head title="Products" />

            <div className="bg-gray-50 py-16 container mx-auto">
                <div className="container mx-auto">
                    <ProductCard
                        key={exampleProduct.id}
                        product={exampleProduct}
                        layout="compact"
                        showBrand={false}
                        imageHeight={320}
                        containerClassName="p-3 rounded-lg shadow-lg w-[300px]"
                    />
                </div>
            </div>
        </>
    );
}
