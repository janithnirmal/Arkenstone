// resources/js/modules/products/pages/ProductAdminPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import ProductForm from '../components/product-admin/ProductForm';
import ProductListTable from '../components/product-admin/ProductListTable';
import { productService } from '../services/productService';
import { Product } from '../types';
import { ProductListResponse } from '../types/http.types';

const ProductAdminPage: React.FC = () => {
    const [paginatedProducts, setPaginatedProducts] = useState<ProductListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // State for the Add/Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = useCallback(async (page: number) => {
        setIsLoading(true);
        try {
            const data = await productService.getProducts({ page });
            setPaginatedProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, fetchProducts]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleOpenModalForCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleFormSuccess = () => {
        handleCloseModal();
        fetchProducts(currentPage); // Refresh the data
    };

    const handleDeleteProduct = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                fetchProducts(currentPage); // Refresh after delete
            } catch (error) {
                console.error('Failed to delete product', error);
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Products</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all the products in your catalog including their name, price, and stock.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleOpenModalForCreate}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
                    >
                        Add Product
                    </button>
                </div>
            </div>

            <div className="mt-8">
                {paginatedProducts && (
                    <ProductListTable
                        paginatedProducts={paginatedProducts}
                        onEdit={handleOpenModalForEdit}
                        onDelete={handleDeleteProduct}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                    />
                )}
            </div>

            {/* Modal for Add/Edit Form */}
            {isModalOpen && (
                 <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                               <div className="sm:flex sm:items-start">
                                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                       <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                                       </h3>
                                       <div className="mt-4">
                                            <ProductForm
                                                productToEdit={editingProduct}
                                                onSuccess={handleFormSuccess}
                                            />
                                       </div>
                                   </div>
                               </div>
                           </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductAdminPage;