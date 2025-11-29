// pages/ProductListingPage.tsx
import { AddToCart, Breadcrumbs, ListingControl, Pagination, ProductCard, SortBar, ViewModeSwitcherProps, ProductImage, ProductCardLayout, ProductImageLayout, WishlistButton, DiscountBadge, DiscountType, SortBarProps, BrandTitle, CategoriesBadgeList, PriceCard, ViewDetailsButton } from "arkenstone-ui";
// import Filter from "arkenstone-ui";
import { Head } from "@inertiajs/react";
// import { on } from "events";

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
        }
    };

    const viewModeProps: ViewModeSwitcherProps = {
        mode: "card",
        onChange: (mode) => {
            console.log("Selected view mode:", mode);
        },
    };


    const product =  {
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
            images: [{
                id: 1,
                product_id: 1,
                image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
                alt_text: "Sample Product Image",
                is_primary: true,
                sort_order: 1,
            }],
            primary_image: null,
        };

    const topPlaceholder =  <div>
         <WishlistButton />
         <DiscountBadge discount={product.discount_value} discountType={product.discount_type as DiscountType} currency="USD" />
    </div>;

    

    const bottomPlaceholder =  <div className="bg-gray-200 w-full h-12"></div>;

    return (
        <>
            <Head title="Products" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                title: "Home",
                                href: "/",
                            },
                            {
                                title: "Products",
                                href: "/products",
                            },
                        ]}
                    />
                </div>
                <div>
                    <Pagination page={1} total={100} pageSize={10} onChange={(page) => console.log(page)} />
                </div>
                <div>
                    <ListingControl sortProps={sortProps} viewModeProps={viewModeProps}/>
                </div>
                <div>
                    <AddToCart onAddToCart={() => {console.log('clicked on cart')}} showIconWithText={true} />
                </div>
                {/* <div className="max-w-sm mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProductCard 
                        product={
                            product
                        }
                        layout = "compact"
                        showWishlist = {true}
                        showDiscount = {true}
                        showViewDetails = {true}
                        showBrand = {true}
                        showPrice = {true}
                    />
                </div> */}

                <div className="max-w-sm mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProductCardLayout 
                        layout="compact"
                        ImageComponent={
                            <ProductImageLayout 
                                imageUrl={product.images[0].image_url}
                                imageAlt={product.images[0].alt_text}
                                width={300}
                                height={300}
                                topPlaceholder={topPlaceholder}
                                bottomPlaceholder={bottomPlaceholder}
                            />
                        }
                        DetailsComponent={
                            <div>
                                <BrandTitle brand={product.brand} />
                                <CategoriesBadgeList categories={product.categories} />
                                <PriceCard price={product.price} salePrice={product.sale_price} />
                                <AddToCart onAddToCart={() => {console.log('clicked on cart')}} showIconWithText={true} />
                                <ViewDetailsButton onClick={()=>{}} />
                            </div>
                        }                    
                    />
                </div>
            </div>
        </>
    );
}