// pages/ProductListingPage.tsx
import { ProductCardListing } from './product/product-listing-page';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    const handleProductClick = (productId: number) => {
        // Navigate to product detail page
        window.location.href = `/products/${productId}`;
    };

    const handleAddToCart = (productId: number) => {
        // Implement your cart logic here
        console.log('Adding product to cart:', productId);
        // Example: dispatch cart action or call cart API
    };

    return (
        <>
            <Head title="Products" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
                        <p className="mt-2 text-gray-600">
                            Browse our collection of premium products
                        </p>
                    </div>

                    {/* Product Listing with Grid */}
                    <ProductCardListing
                        layout="compact"
                        columns={4}
                        gap="md"
                        showWishlist={true}
                        showDiscount={true}
                        showViewDetails={true}
                        showBrand={true}
                        showPrice={true}
                        showPagination={true}
                        showFilters={true}
                        onProductClick={handleProductClick}
                        onAddToCart={handleAddToCart}
                    />
                </div>
            </div>
        </>
    );
}

// Alternative: More customized layout
export function ProductListingPageDetailed() {
    return (
        <>
            <Head title="Products - Detailed View" />
            
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Discover Amazing Products
                        </h1>
                        <p className="text-xl text-blue-100">
                            Quality products at unbeatable prices
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <ProductCardListing
                        layout="detailed"
                        columns={3}
                        gap="lg"
                        showWishlist={true}
                        showDiscount={true}
                        showViewDetails={true}
                        showBrand={true}
                        showPrice={true}
                        showPagination={true}
                        showFilters={true}
                        imageHeight={300}
                        filters={{
                            per_page: 12,
                            sort_by: 'created_at',
                            sort_order: 'desc',
                        }}
                    />
                </div>
            </div>
        </>
    );
}

// Alternative: Compact mobile-friendly layout
export function ProductListingPageCompact() {
    return (
        <>
            <Head title="Products" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>
                    
                    <ProductCardListing
                        layout="compact"
                        columns={6}
                        gap="sm"
                        showWishlist={false}
                        showDiscount={true}
                        showViewDetails={true}
                        showBrand={false}
                        showPrice={true}
                        showPagination={true}
                        showFilters={true}
                        imageHeight={200}
                        filters={{
                            per_page: 24,
                        }}
                    />
                </div>
            </div>
        </>
    );
}

// Alternative: With sidebar filters
export function ProductListingPageWithSidebar() {
    return (
        <>
            <Head title="Products" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                                <h2 className="text-lg font-bold mb-4">Filters</h2>
                                
                                {/* Add your custom filters here */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium mb-2">Price Range</h3>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            className="w-full"
                                        />
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-medium mb-2">Category</h3>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span className="text-sm">Electronics</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span className="text-sm">Clothing</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" className="mr-2" />
                                                <span className="text-sm">Home & Garden</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1">
                            <ProductCardListing
                                layout="compact"
                                columns={3}
                                gap="md"
                                showWishlist={true}
                                showDiscount={true}
                                showViewDetails={true}
                                showBrand={true}
                                showPrice={true}
                                showPagination={true}
                                showFilters={true}
                            />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}