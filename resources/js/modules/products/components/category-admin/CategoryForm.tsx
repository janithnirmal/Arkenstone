// resources/js/modules/products/components/category-admin/CategoryForm.tsx

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { categoryService, CategoryFormData } from '../../services/categoryService';
import { Category } from '../../types';

interface Props {
    categoryToEdit?: Category | null;
    allCategories: Category[]; // We need all categories for the parent dropdown
    onSuccess: () => void;
}

// Re-use the flatten function from the list to create a flat dropdown
const flattenCategoriesForSelect = (categories: Category[], depth = 0): { label: string, value: number }[] => {
    let options: { label: string, value: number }[] = [];
    for (const category of categories) {
        options.push({ label: `${'—'.repeat(depth)} ${category.name}`, value: category.id });
        if (category.children && category.children.length > 0) {
            options = options.concat(flattenCategoriesForSelect(category.children, depth + 1));
        }
    }
    return options;
};

const CategoryForm: React.FC<Props> = ({ categoryToEdit, allCategories, onSuccess }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormData>();

    useEffect(() => {
        if (categoryToEdit) {
            reset({
                name: categoryToEdit.name,
                parent_id: categoryToEdit.parent_id,
            });
        } else {
            reset({ name: '', parent_id: null });
        }
    }, [categoryToEdit, reset]);

    const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
        const payload = {
            ...data,
            parent_id: data.parent_id ? Number(data.parent_id) : null,
        };

        try {
            if (categoryToEdit) {
                await categoryService.updateCategory(categoryToEdit.id, payload);
            } else {
                await categoryService.createCategory(payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save category", error);
        }
    };
    
    // Filter out the category being edited from the list of possible parents
    const parentOptions = allCategories.filter(c => c.id !== categoryToEdit?.id);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Category name is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
                <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">Parent Category</label>
                <select
                    id="parent_id"
                    {...register('parent_id')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                    <option value="">None (Top-Level Category)</option>
                    {flattenCategoriesForSelect(parentOptions).map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;