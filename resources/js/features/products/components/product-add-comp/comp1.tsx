// Example: /resources/js/features/products/components/CreateProductForm.tsx

import { useState } from 'react';
import { useForm } from 'react-hook-form'; // Example using react-hook-form
import { productService } from '../../services/productService';
import { CreateProductData } from '../../types/http.types';

const CreateProductForm = () => {
    const { register, handleSubmit, reset } = useForm<CreateProductData>();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (formData: CreateProductData) => {
        setIsLoading(true);

        try {
            // The `images` field from the form will be a FileList, so we convert it to an array.
            const dataToSubmit: CreateProductData = {
                ...formData,
                price: Number(formData.price), // Ensure price is a number
                stock_quantity: Number(formData.stock_quantity), // Ensure stock is a number
                images: formData.images ? Array.from(formData.images) : [],
            };

            const newProduct = await productService.createProduct(dataToSubmit);
            console.log('Successfully created product:', newProduct);
            // The api utility already shows a success toast, but you can add more actions here.
            reset(); // Clear the form
        } catch (error) {
            // The api utility already shows an error toast.
            console.error('Failed to create product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Input for Name */}
            <div>
                <label>Product Name</label>
                <input {...register('name')} type="text" required />
            </div>

            {/* Input for Description */}
            <div>
                <label>Description</label>
                <textarea {...register('description')} required />
            </div>

            {/* Input for Price */}
            <div>
                <label>Price</label>
                <input {...register('price')} type="number" step="0.01" required />
            </div>

            {/* Input for Stock */}
            <div>
                <label>Stock Quantity</label>
                <input {...register('stock_quantity')} type="number" required />
            </div>

            {/* Example for Categories (could be a multi-select dropdown) */}
            <div>
                <label>Categories (e.g., 1,2,3)</label>
                <input {...register('categories')} type="text" />
            </div>

            {/* Input for Images */}
            <div>
                <label>Images</label>
                <input {...register('images')} type="file" multiple accept="image/*" />
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Product'}
            </button>
        </form>
    );
};

export default CreateProductForm;
