import { ChevronDown, Eye, Filter, Grid, Heart, List, Minus, Package, Plus, SearchCheck, ShoppingCart, Star, Tag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Product, Taxonomy, Term } from '../../types';

export default function AdvancedProductCatalog({ data }: { data: Product[] }) {
    const [products] = useState<Product[]>(data);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'created_at'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<any>({
        category: '',
        priceRange: [0, 200],
        taxonomy: '',
        term: '',
        inStock: false,
    });

    // Memoized filtered and sorted products
    const filteredProducts = useMemo(() => {
        let filtered = products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !filters.category || product.categories.some((cat) => cat.slug === filters.category);

            const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

            const matchesStock = !filters.inStock || product.stock_quantity > 0;

            const matchesTerm = !filters.term || product.terms.some((term) => term.slug === filters.term);

            return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesTerm;
        });

        // Sort products
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'stock':
                    comparison = a.stock_quantity - b.stock_quantity;
                    break;
                case 'created_at':
                    comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    break;
                default:
                    comparison = a.name.localeCompare(b.name);
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }, [products, searchTerm, filters, sortBy, sortOrder]);

    // Cart operations
    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
    };

    // Favorites operations
    const toggleFavorite = (productId: number) => {
        setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
    };

    // Get unique categories and terms for filters
    const uniqueCategories = useMemo(() => {
        const cats = products.flatMap((p) => p.categories);
        return Array.from(new Set(cats.map((c) => c.slug))).map((slug) => cats.find((c) => c.slug === slug)!);
    }, [products]);

    const uniqueTerms = useMemo(() => {
        const terms = products.flatMap((p) => p.terms);
        return Array.from(new Set(terms.map((t) => t.slug))).map((slug) => terms.find((t) => t.slug === slug)!);
    }, [products]);

    const uniqueTaxonomies = useMemo(() => {
        const taxonomies = products.flatMap((p) => p.terms.map((t) => t.taxonomy));
        return Array.from(new Set(taxonomies.map((t) => t.id))).map((id) => taxonomies.find((t) => t.id === id)!);
    }, [products]);

    const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Package className="h-8 w-8 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900">Advanced Catalog</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setFavorites([])}
                                className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-red-600"
                            >
                                <Heart className="h-5 w-5" />
                                <span className="text-sm">{favorites.length}</span>
                            </button>

                            <div className="relative">
                                <button className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-blue-600">
                                    <ShoppingCart className="h-5 w-5" />
                                    <span className="text-sm">{cartItemCount}</span>
                                </button>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Search and Controls */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col gap-4 lg:flex-row">
                        <div className="relative flex-1">
                            <SearchCheck className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filters</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-');
                                    setSortBy(field as typeof sortBy);
                                    setSortOrder(order as typeof sortOrder);
                                }}
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="price-asc">Price Low-High</option>
                                <option value="price-desc">Price High-Low</option>
                                <option value="stock-desc">Stock High-Low</option>
                                <option value="created_at-desc">Newest First</option>
                            </select>

                            <div className="flex overflow-hidden rounded-lg border border-gray-300">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                                >
                                    <Grid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters((prev: any) => ({ ...prev, category: e.target.value }))}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        {uniqueCategories.map((category) => (
                                            <option key={category.id} value={category.slug}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Taxonomy</label>
                                    <select
                                        value={filters.taxonomy}
                                        onChange={(e) => setFilters((prev: any) => ({ ...prev, taxonomy: e.target.value, term: '' }))}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Taxonomies</option>
                                        {uniqueTaxonomies.map((taxonomy) => (
                                            <option key={taxonomy.id} value={taxonomy.name}>
                                                {taxonomy.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Term</label>
                                    <select
                                        value={filters.term}
                                        onChange={(e) => setFilters((prev: any) => ({ ...prev, term: e.target.value }))}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Terms</option>
                                        {uniqueTerms
                                            .filter((term) => !filters.taxonomy || term.taxonomy.name === filters.taxonomy)
                                            .map((term) => (
                                                <option key={term.id} value={term.slug}>
                                                    {term.name} ({term.taxonomy.name})
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={filters.priceRange[1]}
                                        onChange={(e) =>
                                            setFilters((prev: any) => ({
                                                ...prev,
                                                priceRange: [0, parseInt(e.target.value)],
                                            }))
                                        }
                                        className="w-full"
                                    />
                                    <div className="mt-2 flex items-center">
                                        <input
                                            type="checkbox"
                                            id="inStock"
                                            checked={filters.inStock}
                                            onChange={(e) => setFilters((prev: any) => ({ ...prev, inStock: e.target.checked }))}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                                            In Stock Only
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                <div className="mb-6 text-gray-600">
                    Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    {cart.length > 0 && (
                        <span className="ml-4 text-blue-600">
                            Cart: {cartItemCount} items (${cartTotal.toFixed(2)})
                        </span>
                    )}
                </div>

                {/* Products Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}>
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
                                viewMode === 'list' ? 'flex' : ''
                            }`}
                        >
                            <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'relative'}>
                                <img
                                    src={product.images.find((img) => img.is_primary)?.path || product.images[0]?.path}
                                    alt={product.images.find((img) => img.is_primary)?.alt_text || product.name}
                                    className={`w-full object-cover ${viewMode === 'list' ? 'h-full' : 'h-48'}`}
                                />

                                {product.stock_quantity === 0 && (
                                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                                        <span className="font-semibold text-white">Out of Stock</span>
                                    </div>
                                )}

                                <div className="absolute top-2 right-2 flex space-x-1">
                                    <button
                                        onClick={() => toggleFavorite(product.id)}
                                        className={`rounded-full p-1.5 transition-colors ${
                                            favorites.includes(product.id)
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-opacity-80 bg-white text-gray-600 hover:bg-red-100 hover:text-red-600'
                                        }`}
                                    >
                                        <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="bg-opacity-80 rounded-full bg-white p-1.5 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>

                                {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                                    <div className="absolute top-2 left-2">
                                        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">Low Stock</span>
                                    </div>
                                )}
                            </div>

                            <div className={`p-4 ${viewMode === 'list' ? 'flex flex-1 flex-col justify-between' : ''}`}>
                                <div>
                                    <h3 className="mb-2 line-clamp-1 font-semibold text-gray-900">{product.name}</h3>
                                    <p className={`mb-3 text-sm text-gray-600 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2'}`}>
                                        {product.description}
                                    </p>

                                    {/* Categories */}
                                    <div className="mb-2">
                                        <div className="flex flex-wrap gap-1">
                                            {product.categories.map((category) => (
                                                <span key={category.id} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                    {category.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Terms */}
                                    <div className="mb-3">
                                        <div className="flex flex-wrap gap-1">
                                            {product.terms.slice(0, 3).map((term) => (
                                                <span
                                                    key={term.id}
                                                    className="flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                                                >
                                                    <Tag className="mr-1 h-3 w-3" />
                                                    {term.name}
                                                </span>
                                            ))}
                                            {product.terms.length > 3 && (
                                                <span className="text-xs text-gray-500">+{product.terms.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                                    <div className={`${viewMode === 'list' ? 'flex items-center space-x-4' : 'mb-3'}`}>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                            <span className="text-sm text-gray-500">({product.stock_quantity} in stock)</span>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < Math.floor(Math.random() * 2 + 3) ? 'fill-current' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="ml-1 text-sm text-gray-500">({Math.floor(Math.random() * 50 + 10)})</span>
                                        </div>
                                    </div>

                                    <div className={`${viewMode === 'list' ? '' : 'flex items-center justify-between'}`}>
                                        {cart.find((item) => item.product.id === product.id) ? (
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(product.id, cart.find((item) => item.product.id === product.id)!.quantity - 1)
                                                    }
                                                    className="rounded-full bg-gray-200 p-1 transition-colors hover:bg-gray-300"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="font-semibold">{cart.find((item) => item.product.id === product.id)?.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(product.id, cart.find((item) => item.product.id === product.id)!.quantity + 1)
                                                    }
                                                    className="rounded-full bg-gray-200 p-1 transition-colors hover:bg-gray-300"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(product.id)}
                                                    className="text-sm text-red-600 transition-colors hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock_quantity === 0}
                                                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                                                    product.stock_quantity === 0
                                                        ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            >
                                                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-12 text-center">
                        <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
                        <div className="p-6">
                            <div className="mb-6 flex items-start justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                                <button onClick={() => setSelectedProduct(null)} className="text-gray-500 transition-colors hover:text-gray-700">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                <div>
                                    <div className="space-y-4">
                                        <img
                                            src={selectedProduct.images.find((img) => img.is_primary)?.path || selectedProduct.images[0]?.path}
                                            alt={selectedProduct.name}
                                            className="h-96 w-full rounded-lg object-cover"
                                        />
                                        <div className="flex space-x-2 overflow-x-auto">
                                            {selectedProduct.images.map((image) => (
                                                <img
                                                    key={image.id}
                                                    src={image.path}
                                                    alt={image.alt_text || selectedProduct.name}
                                                    className="h-20 w-20 cursor-pointer rounded-lg border-2 border-gray-200 object-cover transition-colors hover:border-blue-500"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="mb-2 text-3xl font-bold text-gray-900">${selectedProduct.price.toFixed(2)}</div>
                                        <div className="mb-4 text-gray-600">Stock: {selectedProduct.stock_quantity} available</div>
                                        <p className="leading-relaxed text-gray-700">{selectedProduct.description}</p>
                                    </div>

                                    {/* Categories Section */}
                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">Categories</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.categories.map((category) => (
                                                <span key={category.id} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                                                    {category.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Taxonomies and Terms */}
                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">Product Attributes</h3>
                                        <div className="space-y-3">
                                            {selectedProduct.terms
                                                .reduce(
                                                    (acc, term) => {
                                                        const existing = acc.find((group) => group.taxonomy.id === term.taxonomy.id);
                                                        if (existing) {
                                                            existing.terms.push(term);
                                                        } else {
                                                            acc.push({ taxonomy: term.taxonomy, terms: [term] });
                                                        }
                                                        return acc;
                                                    },
                                                    [] as { taxonomy: Taxonomy; terms: Term[] }[],
                                                )
                                                .map((group) => (
                                                    <div key={group.taxonomy.id}>
                                                        <h4 className="mb-1 font-medium text-gray-800">{group.taxonomy.name}</h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {group.terms.map((term) => (
                                                                <span
                                                                    key={term.id}
                                                                    className="flex items-center rounded bg-gray-100 px-2 py-1 text-sm text-gray-700"
                                                                >
                                                                    <Tag className="mr-1 h-3 w-3" />
                                                                    {term.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Product Metadata */}
                                    <div className="border-t pt-4 text-sm text-gray-500">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <strong>Product ID:</strong> {selectedProduct.id}
                                            </div>
                                            <div>
                                                <strong>SKU:</strong> {selectedProduct.slug.toUpperCase()}
                                            </div>
                                            <div>
                                                <strong>Created:</strong> {new Date(selectedProduct.created_at).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <strong>Updated:</strong> {new Date(selectedProduct.updated_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-4 border-t pt-4">
                                        <button
                                            onClick={() => {
                                                addToCart(selectedProduct);
                                                setSelectedProduct(null);
                                            }}
                                            disabled={selectedProduct.stock_quantity === 0}
                                            className={`flex-1 rounded-lg px-6 py-3 font-medium transition-colors ${
                                                selectedProduct.stock_quantity === 0
                                                    ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {selectedProduct.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>

                                        <button
                                            onClick={() => toggleFavorite(selectedProduct.id)}
                                            className={`rounded-lg px-6 py-3 font-medium transition-colors ${
                                                favorites.includes(selectedProduct.id)
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Heart className={`h-5 w-5 ${favorites.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
