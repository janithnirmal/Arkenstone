// components/ProductCardListing.tsx
import { useEffect } from 'react';
import { 
  Product, 
  ProductCard, 
  Pagination, 
  useCatalogStore,
  useProductCardStore,
  useCartStore
} from 'arkenstone-ui';
import { productService, ProductFilters } from '../../services/product-service';
import type { FilterItemProps } from 'arkenstone-ui';
import Filters from 'arkenstone-ui';
import Search from 'arkenstone-ui';

interface ProductCardListingProps {
  filters?: ProductFilters;
  layout?: 'compact' | 'detailed';
  showWishlist?: boolean;
  showDiscount?: boolean;
  showViewDetails?: boolean;
  showBrand?: boolean;
  showPrice?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  imageHeight?: number | string;
  onProductClick?: (productId: number) => void;
  onAddToCart?: (productId: number) => void;
  showPagination?: boolean;
  showFilters?: boolean;
}

export const ProductCardListing: React.FC<ProductCardListingProps> = ({
  filters: initialFilters = {},
  layout = 'compact',
  showWishlist = true,
  showDiscount = true,
  showViewDetails = true,
  showBrand = true,
  showPrice = true,
  columns = 4,
  gap = 'md',
  imageHeight,
  onProductClick,
  onAddToCart,
  showPagination = true,
  showFilters = true,
}) => {
  // Use Zustand stores
  const {
    products,
    total,
    loading,
    searchQuery,
    filters: storeFilters,
    page,
    pageSize,
    setSearchQuery,
    setFilters,
    setPage,
    fetchProducts
  } = useCatalogStore();

  const {
    toggleWishlist,
    isWishlisted,
    viewDetails,
  } = useProductCardStore();

  const {
    addToCart: addToCartStore,
  } = useCartStore();

  // Define custom filters configuration
  const productFilters: FilterItemProps[] = [
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox',
      collapsible: true,
      defaultCollapsed: false,
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Books', value: 'books' },
        { label: 'Home & Garden', value: 'home-garden' },
      ],
    },
    {
      id: 'brand',
      title: 'Brand',
      type: 'checkbox',
      collapsible: true,
      defaultCollapsed: false,
      options: [
        { label: 'Nike', value: 'nike' },
        { label: 'Adidas', value: 'adidas' },
        { label: 'Puma', value: 'puma' },
        { label: 'Reebok', value: 'reebok' },
      ],
    },
    {
      id: 'price',
      title: 'Price Range',
      type: 'range',
      collapsible: true,
      defaultCollapsed: false,
      options: [
        { 
          label: 'Price',
          value: 'price_range',
          min: 0,
          max: 1000,
          step: 10,
        },
      ],
    },
    {
      id: 'rating',
      title: 'Rating',
      type: 'rating',
      collapsible: true,
      defaultCollapsed: false,
      options: [
        { label: '5 Stars', value: 5, rating: 5 },
        { label: '4 Stars & Up', value: 4, rating: 4 },
        { label: '3 Stars & Up', value: 3, rating: 3 },
        { label: '2 Stars & Up', value: 2, rating: 2 },
        { label: '1 Star & Up', value: 1, rating: 1 },
      ],
    },
    {
      id: 'availability',
      title: 'Availability',
      type: 'radio',
      collapsible: true,
      defaultCollapsed: false,
      options: [
        { label: 'In Stock', value: 'in_stock' },
        { label: 'Out of Stock', value: 'out_of_stock' },
        { label: 'All', value: 'all' },
      ],
    },
  ];

  // Initialize filters on mount
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters({ per_page: 12, ...initialFilters });
    }
  }, []);

  // Fetch products when page or filters change
  useEffect(() => {
    fetchProducts();
  }, [page, storeFilters]);

  const handleToggleWishlist = (productId: number) => {
    toggleWishlist(productId);
  };

  const handleViewDetails = (productId: number) => {
    if (onProductClick) {
      onProductClick(productId);
    } else {
      viewDetails(productId);
      window.location.href = `/products/${productId}`;
    }
  };

  const handleAddToCart = (productId: number) => {
    if (onAddToCart) {
      onAddToCart(productId);
    } else {
      addToCartStore(productId, 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (value: string) => {
    setFilters({ ...storeFilters, search: value });
    setPage(1);
  };

  const handleFilterChange = (values: Record<string, any>) => {
    // Update filters in store
    const newFilters: Record<string, any> = {};

    // Handle category filter
    if (values.category && Array.isArray(values.category)) {
      newFilters.category_id = values.category[0];
    }

    // Handle brand filter
    if (values.brand && Array.isArray(values.brand)) {
      newFilters.brand_id = values.brand[0];
    }

    // Handle price range
    if (values.price) {
      if (typeof values.price === 'object' && 'min' in values.price) {
        newFilters.min_price = values.price.min;
        newFilters.max_price = values.price.max;
      }
    }

    setFilters({ ...storeFilters, ...newFilters });
    setPage(1);
  };

  // Grid configuration
  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
  }[gap];

  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  }[columns];

  const totalPages = Math.ceil(total / pageSize);

  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className={`grid ${gridColsClass} ${gapClass}`}>
          {Array.from({ length: pageSize || 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Search
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        debounce={300}
      />

      {/* Filters */}
      {showFilters && (
        <Filter 
          filters={productFilters}
          direction="vertical"
          value={storeFilters}
          onChange={handleFilterChange}
        />
      )}

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className={`grid ${gridColsClass} ${gapClass}`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              layout={layout}
              showWishlist={showWishlist}
              showDiscount={showDiscount}
              showViewDetails={showViewDetails}
              showBrand={showBrand}
              showPrice={showPrice}
              imageHeight={imageHeight}
              onToggleWishlist={() => handleToggleWishlist(product.id)}
              onViewDetails={() => handleViewDetails(product.id)}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination 
            page={page} 
            total={totalPages} 
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCardListing;