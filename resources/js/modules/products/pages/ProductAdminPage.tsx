// resources/js/modules/products/pages/ProductAdminPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
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
                    <Button onClick={handleOpenModalForCreate}>
                        Add Product
                    </Button>
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
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                footer={
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                }
            >
                <ProductForm
                    productToEdit={editingProduct}
                    onSuccess={handleFormSuccess}
                />
            </Modal>
        </div>
    );
};

export default ProductAdminPage;