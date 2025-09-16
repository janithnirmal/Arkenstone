// resources/js/modules/products/components/brand-admin/BrandForm.tsx

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { brandService, BrandFormData, BrandFormShape } from '../../services/brandService';
import { Brand } from '../../types';

interface Props {
    brandToEdit?: Brand | null;
    onSuccess: () => void;
}

const BrandForm: React.FC<Props> = ({ brandToEdit, onSuccess }) => {
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<BrandFormShape>();
    const [preview, setPreview] = useState<string | null>(brandToEdit?.logo || null);

    // watch('logo') returns a FileList or undefined
    const logoFileList = watch('logo');

    useEffect(() => {
        if (brandToEdit) {
            reset({ name: brandToEdit.name });
            setPreview(brandToEdit.logo || null);
        } else {
            reset({ name: '' });
            setPreview(null);
        }
    }, [brandToEdit, reset]);

    useEffect(() => {
        // Create a preview URL for the selected file
        if (logoFileList && logoFileList.length > 0) {
            const file = logoFileList[0]; // Access the first file
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [logoFileList]);

    const onSubmit: SubmitHandler<BrandFormShape> = async (data) => {
        
        // Create a payload that matches the `BrandFormData` interface from the service.
        const payload: BrandFormData = {
            name: data.name,
            // Extract the single File from the FileList, or null if empty.
            logo: data.logo && data.logo.length > 0 ? data.logo[0] : null,
        };

        try {
            if (brandToEdit) {
                await brandService.updateBrand(brandToEdit.id, payload);
            } else {
                await brandService.createBrand(payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save brand", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Brand Name</label>
                <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Brand name is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Brand Logo</label>
                <div className="mt-1 flex items-center space-x-4">
                    <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        {preview ? (
                            <img src={preview} alt="Logo preview" className="h-full w-full object-cover" />
                        ) : (
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.993A1 1 0 001 21h22a1 1 0 001-1.007zM12 15a3 3 0 100-6 3 3 0 000 6z" />
                            </svg>
                        )}
                    </span>
                    <label htmlFor="logo-upload" className="cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50">
                        <span>Change</span>
                        <input id="logo-upload" {...register('logo')} type="file" className="sr-only" accept="image/*" />
                    </label>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Brand'}
                </button>
            </div>
        </form>
    );
};

export default BrandForm;