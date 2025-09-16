// resources/js/modules/products/pages/StockManagementPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types';
import styles from '../assets/css/StockManagementPage.module.css';

// A constant to define the low stock threshold
const LOW_STOCK_THRESHOLD = 10;

const StockManagementPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch all products - assuming the API can return all with a high limit
            // In a real-world scenario with thousands of products, this would need server-side searching/filtering
            const response = await productService.getProducts({ limit: 9999 });
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products for stock management", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    const handleStockUpdate = async (type: 'product' | 'variant', id: number, newStock: string) => {
        const stockValue = parseInt(newStock, 10);
        if (isNaN(stockValue) || stockValue < 0) {
            // Optionally show an error toast here
            return;
        }

        try {
            if (type === 'product') {
                await productService.updateProductStock(id, stockValue);
            } else {
                await productService.updateVariantStock(id, stockValue);
            }
            // Refresh data to show the update and any new alerts
            fetchAllProducts();
        } catch (error) {
            console.error(`Failed to update stock for ${type} ${id}`, error);
            // Re-fetch to revert the optimistic UI change on failure
            fetchAllProducts();
        }
    };
    
    const filteredProducts = products.filter(product => {
        const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        if (!searchMatch) return false;

        const hasLowStockVariant = product.variants.some(v => v.stock > 0 && v.stock <= LOW_STOCK_THRESHOLD);
        const hasOutOfStockVariant = product.variants.some(v => v.stock === 0);
        
        switch (filter) {
            case 'low':
                return (product.variants.length > 0)
                    ? hasLowStockVariant
                    : (product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD);
            case 'out':
                 return (product.variants.length > 0)
                    ? hasOutOfStockVariant
                    : product.stock === 0;
            case 'all':
            default:
                return true;
        }
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Stock Management</h1>
                    <p className="mt-2 text-sm text-gray-700">Quickly view and update inventory levels for all products and variants.</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by product name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field w-full"
                    />
                </div>
                {/* <div className="flex items-center space-x-2">
                     <button onClick={() => setFilter('all')} className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}>All Items</button>
                     <button onClick={() => setFilter('low')} className={filter === 'low' ? 'btn-primary-orange' : 'btn-secondary'}>Low Stock</button>
                     <button onClick={() => setFilter('out')} className={filter === 'out' ? 'btn-primary-red' : 'btn-secondary'}>Out of Stock</button>
                </div> */}
                <div className="flex items-center space-x-2">
                     <button onClick={() => setFilter('all')} className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}>All Items</button>
                     <button onClick={() => setFilter('low')} className={filter === 'low' ? `${'btn-secondary'} ${styles.btnPrimaryOrange}` : 'btn-secondary'}>Low Stock</button>
                     <button onClick={() => setFilter('out')} className={filter === 'out' ? `${'btn-secondary'} ${styles.btnPrimaryRed}` : 'btn-secondary'}>Out of Stock</button>
                </div>
            </div>

            {/* Stock List */}
            <div className="mt-8 bg-white shadow-md rounded-lg">
                <div className="divide-y divide-gray-200">
                    {isLoading ? (
                        <p className="p-10 text-center">Loading inventory...</p>
                    ) : filteredProducts.map(product => (
                        <div key={product.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                </div>
                                {product.variants.length === 0 && (
                                    <StockEditor
                                        id={product.id}
                                        type="product"
                                        initialStock={product.stock}
                                        onSave={handleStockUpdate}
                                    />
                                )}
                            </div>
                            {product.variants.length > 0 && (
                                <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-2">
                                    {product.variants.map(variant => (
                                        <div key={variant.id} className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{variant.name}</p>
                                                <p className="text-xs text-gray-500">SKU: {variant.sku}</p>
                                            </div>
                                            <StockEditor
                                                id={variant.id}
                                                type="variant"
                                                initialStock={variant.stock}
                                                onSave={handleStockUpdate}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                     {!isLoading && filteredProducts.length === 0 && (
                        <p className="p-10 text-center text-gray-500">No products match the current filters.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// A small sub-component for the inline stock editor
interface StockEditorProps {
    id: number;
    type: 'product' | 'variant';
    initialStock: number;
    onSave: (type: 'product' | 'variant', id: number, newStock: string) => void;
}

const StockEditor: React.FC<StockEditorProps> = ({ id, type, initialStock, onSave }) => {
    const [stock, setStock] = useState(initialStock.toString());
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setStock(initialStock.toString());
    }, [initialStock]);

    const handleSave = () => {
        onSave(type, id, stock);
        setIsEditing(false);
    };
    
    const getStockAlertClasses = () => {
        const stockNum = Number(stock);
        if (stockNum === 0) return 'bg-red-100 text-red-800 ring-red-600/20';
        if (stockNum <= LOW_STOCK_THRESHOLD) return 'bg-orange-100 text-orange-800 ring-orange-600/20';
        return 'bg-green-100 text-green-800 ring-green-600/20';
    };

    return (
        <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${getStockAlertClasses()}`}>
                {initialStock} in stock
            </span>
            <input
                type="number"
                value={stock}
                onChange={(e) => {
                    setStock(e.target.value);
                    setIsEditing(true);
                }}
                className="input-sm w-20 text-center"
            />
            {isEditing && (
                //  <button onClick={handleSave} className="btn-primary-green text-xs">Save</button>
                <button onClick={handleSave} className={`text-xs ${styles.btnPrimaryGreen}`}>Save</button>
            )}
        </div>
    );
};


export default StockManagementPage;