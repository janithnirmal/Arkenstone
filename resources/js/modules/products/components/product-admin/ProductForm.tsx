// resources/js/modules/products/components/product-admin/ProductForm.tsx

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { productService } from '../../services/productService';
import { Brand, Category, Product } from '../../types';
import VariantManager from './VariantManager'; 
import ProductImageManager from './ProductImageManager';

interface ProductFormData {
    name: string;
    sku: string;
    description: string;
    price: number;
    stock: number;
    is_active: boolean;
    brand_id: number;
    category_ids: number[];
}

interface Props {
    productToEdit?: Product | null;
    onSuccess: () => void; // Callback to close modal and refresh list
}

const ProductForm: React.FC<Props> = ({ productToEdit, onSuccess }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        // Fetch brands and categories when the component mounts
        const fetchData = async () => {
            try {
                // productService.getBrands() returns Promise<Brand[]>
                // productService.getCategories() returns Promise<Category[]>
                const [brandsData, categoriesData] = await Promise.all([
                    productService.getBrands(),
                    productService.getCategories(),
                ]);

                // Correctly set state with the direct array results
                setBrands(brandsData);
                setCategories(categoriesData);

            } catch (error) {
                console.error("Failed to fetch brands or categories", error);
            }
        };
        fetchData();
    }, []); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
        if (productToEdit) {
            reset({
                name: productToEdit.name,
                sku: productToEdit.sku,
                description: productToEdit.description,
                price: productToEdit.price,
                stock: productToEdit.stock,
                is_active: productToEdit.is_active,
                brand_id: productToEdit.brand?.id,
                category_ids: productToEdit.categories.map(cat => cat.id),
            });
        } else {
            reset({ is_active: true }); // Default to active for new products
        }
    }, [productToEdit, reset]);

    const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
        try {
            const formData = {
                ...data,
                price: Number(data.price), // Ensure numbers are correctly formatted
                stock: Number(data.stock),
                brand_id: Number(data.brand_id),
                category_ids: data.category_ids.map(id => Number(id)),
            };

            if (productToEdit) {
                // Update existing product
                await productService.updateProduct(productToEdit.id, formData);
            } else {
                // Create new product
                await productService.createProduct(formData);
            }
            onSuccess(); // Signal success to the parent component
        } catch (error) {
            console.error("Failed to save product", error);
            // Error toast is already handled by the api utility
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input id="name" type="text" {...register('name', { required: 'Product name is required' })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                     <div>
                        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                        <input id="sku" type="text" {...register('sku', { required: 'SKU is required' })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input id="price" type="number" step="0.01" {...register('price', { required: 'Price is required', valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                        <input id="stock" type="number" {...register('stock', { required: 'Stock is required', valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700">Brand</label>
                        <select id="brand_id" {...register('brand_id', { required: 'Brand is required' })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option value="">Select a Brand</option>
                            {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                        </select>
                        {errors.brand_id && <p className="mt-1 text-sm text-red-600">{errors.brand_id.message}</p>}
                    </div>
                </div>

                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" {...register('description')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Categories</label>
                    <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-300 p-2 space-y-2">
                        {categories.map(category => (
                            <div key={category.id} className="flex items-center">
                                <input id={`category-${category.id}`} type="checkbox" {...register('category_ids')} value={category.id} className="h-4 w-4 rounded border-gray-300"/>
                                <label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-600">{category.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input id="is_active" type="checkbox" {...register('is_active')} className="h-4 w-4 rounded border-gray-300" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="is_active" className="font-medium text-gray-700">Product is Active</label>
                        <p className="text-gray-500">Uncheck to archive this product.</p>
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : (productToEdit ? 'Update Product Details' : 'Create Product')}
                    </button>
                </div>
            </form>

            {/*IMAGE MANAGEMENT SECTION*/}
            {productToEdit && (
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900">Image Management</h2>
                    <p className="text-sm text-gray-500 mb-4">Upload, view, and delete images for this product.</p>
                    <ProductImageManager product={productToEdit} onSuccess={onSuccess} />
                </div>
            )}

            {/*VARIANT SECTION*/}
            {productToEdit && (
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900">Variant Management</h2>
                    <p className="text-sm text-gray-500 mb-4">Add or edit product variants like color and size. Each variant can have its own SKU, price, and stock level.</p>
                    <VariantManager product={productToEdit} onVariantsChange={onSuccess} />
                </div>
            )}
        </>
    );
};

export default ProductForm;