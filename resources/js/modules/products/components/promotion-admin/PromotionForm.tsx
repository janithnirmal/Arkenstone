// resources/js/modules/products/components/promotion-admin/PromotionForm.tsx

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Brand, Category, Product, Promotion } from '../../types';
import { PromotionFormData, promotionService } from '../../services/promotionService';
import { productService } from '../../services/productService';

const PromotionForm: React.FC<{ promotionToEdit?: Promotion | null; onSuccess: () => void }> = ({ promotionToEdit, onSuccess }) => {
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<PromotionFormData>();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const promotionType = watch('type');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // productService.getBrands() returns a simple Brand[] array
                const [productResponse, categoryData, brandData] = await Promise.all([
                    productService.getProducts({ limit: 1000 }),
                    productService.getCategories(),
                    productService.getBrands(),
                ]);
                setProducts(productResponse.data);
                setCategories(categoryData);
                setBrands(brandData);
            } catch (error) {
                console.error("Failed to fetch entities for promotion form", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (promotionToEdit) {
            reset({
                ...promotionToEdit,
                start_date: promotionToEdit.start_date.split('T')[0],
                end_date: promotionToEdit.end_date.split('T')[0],
            });
        } else {
            reset({ is_active: true, type: 'global' });
        }
    }, [promotionToEdit, reset]);

    const onSubmit: SubmitHandler<PromotionFormData> = async (data) => {
        const payload = {
            ...data,
            discount_percent: Number(data.discount_percent),
            entity_id: data.type === 'global' ? null : Number(data.entity_id),
        };
        try {
            if (promotionToEdit) {
                await promotionService.updatePromotion(promotionToEdit.id, payload);
            } else {
                await promotionService.createPromotion(payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save promotion", error);
        }
    };

    const renderEntitySelector = () => {
        switch (promotionType) {
            case 'product':
                return (
                    <select {...register('entity_id', { required: 'Please select a product' })} className="input-field">
                        <option value="">Select a Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                );
            case 'category':
                return (
                    <select {...register('entity_id', { required: 'Please select a category' })} className="input-field">
                        <option value="">Select a Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                );
            case 'brand':
                 return (
                    <select {...register('entity_id', { required: 'Please select a brand' })} className="input-field">
                        <option value="">Select a Brand</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                );
            case 'global':
            default:
                return <p className="text-sm text-gray-500 mt-2">This promotion will apply to the entire cart.</p>;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label>Title</label>
                <input {...register('title', { required: 'Title is required' })} className="input-field" />
                {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Discount (%)</label>
                    <input type="number" {...register('discount_percent', { required: 'Discount is required', min: 1, max: 100 })} className="input-field" />
                    {errors.discount_percent && <p className="error-text">{errors.discount_percent.message}</p>}
                </div>
                <div>
                    <label>Promotion Type</label>
                    <select {...register('type')} className="input-field">
                        <option value="global">Global (Cart)</option>
                        <option value="product">Specific Product</option>
                        <option value="category">Specific Category</option>
                        <option value="brand">Specific Brand</option>
                    </select>
                </div>
            </div>
            <div>
                <label>Link To</label>
                {renderEntitySelector()}
                {errors.entity_id && <p className="error-text">{errors.entity_id.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Start Date</label>
                    <input type="date" {...register('start_date', { required: 'Start date is required' })} className="input-field" />
                    {errors.start_date && <p className="error-text">{errors.start_date.message}</p>}
                </div>
                 <div>
                    <label>End Date</label>
                    <input type="date" {...register('end_date', { required: 'End date is required' })} className="input-field" />
                    {errors.end_date && <p className="error-text">{errors.end_date.message}</p>}
                </div>
            </div>
            <div>
                 <label>Description (Optional)</label>
                 <textarea {...register('description')} rows={3} className="input-field" />
            </div>
            <div className="flex items-center">
                <input type="checkbox" {...register('is_active')} id="is_active" className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Activate Promotion</label>
            </div>
            <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Saving...' : 'Save Promotion'}
                </button>
            </div>
        </form>
    );
};

export default PromotionForm;