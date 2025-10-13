// resources/js/pages/Products/productsConfig.ts

import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component
import { DataManagerConfig } from '@core/components/data-manager/types';
import { ColumnDef } from '@tanstack/react-table';

/**
 * Helper function to format currency.
 */
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

// Define the columns for the products table.
const productTableColumns: ColumnDef<any>[] = [
    {
        id: 'primary_image', // give a unique column ID
        accessorFn: (row) => row.images?.[0]?.url ?? '',
        header: 'Image',
        cell: ({ row }) => {
            const imageUrl = row.getValue<string>('primary_image'); // pass the column ID
            const productName = row.original.name as string;
            return <img src={imageUrl} alt={productName} className="h-16 w-16 rounded-md object-cover" />;
        },
    },
    {
        accessorKey: 'name',
        header: 'Product Name',
    },
    {
        // Accessing nested data requires a custom accessor function.
        accessorFn: (row) => row.brand.name,
        id: 'brandName', // A unique ID is required when using an accessorFn.
        header: 'Brand',
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => formatCurrency(row.getValue('price')),
    },
    {
        accessorKey: 'quantity',
        header: 'Stock',
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue('is_active');
            return isActive ? <Badge variant="default">Active</Badge> : <Badge variant="destructive">Inactive</Badge>;
        },
    },
];

// This is the main configuration object for the DataManager.
export const productsConfig: DataManagerConfig = {
    /**
     * The base API endpoint for product operations.
     */
    apiBaseUrl: '/products',

    /**
     * User-friendly name for the data.
     */
    dataName: 'Product',

    /**
     * Configuration for the data table display.
     */
    tableConfig: {
        columns: productTableColumns,
        searchComponent: [
            { column: 'name', placeholder: 'Search by product name...' },
            { column: 'sku', placeholder: 'Search by SKU...' },
        ],
    },

    /**
     * Base configuration for the multi-step product form.
     */
    formConfig: {
        steps: [
            // Step 1: Core Details
            {
                title: 'Basic Information',
                description: 'Provide the main details for the product.',
                fields: [
                    {
                        type: 'text',
                        name: 'name',
                        label: 'Product Name',
                        placeholder: 'e.g., Classic Cotton T-Shirt',
                        validation: { required: 'Product name is required.' },
                    },
                    {
                        type: 'textarea',
                        name: 'description',
                        label: 'Description',
                        placeholder: 'Describe the product...',
                        validation: {
                            maxLength: {
                                value: 500,
                                message: 'Description cannot exceed 500 characters.',
                            },
                        },
                    },
                    {
                        type: 'text',
                        name: 'sku',
                        label: 'SKU (Stock Keeping Unit)',
                        placeholder: 'e.g., STY-TSH-001',
                        validation: { required: 'SKU is required.' },
                    },
                    {
                        type: 'checkbox',
                        name: 'is_active',
                        label: 'Product is Active',
                        defaultValue: true,
                    },
                ],
            },
            // Step 2: Pricing and Inventory
            {
                title: 'Pricing & Inventory',
                description: 'Set the price and stock levels.',
                fields: [
                    {
                        type: 'number',
                        name: 'price',
                        label: 'Price',
                        placeholder: '0.00',
                        validation: {
                            required: 'Price is required.',
                            min: { value: 0.01, message: 'Price must be greater than zero.' },
                        },
                    },
                    {
                        type: 'number',
                        name: 'quantity',
                        label: 'Stock Quantity',
                        placeholder: '0',
                        validation: {
                            required: 'Quantity is required.',
                            min: { value: 0, message: 'Quantity cannot be negative.' },
                        },
                    },
                    {
                        type: 'select',
                        name: 'discount_type',
                        label: 'Discount Type',
                        defaultValue: 0,
                        options: [
                            { value: 0, label: 'None' },
                            { value: 1, label: 'Percentage (%)' },
                            { value: 2, label: 'Fixed Amount' },
                        ],
                    },
                    {
                        type: 'number',
                        name: 'discount_value',
                        label: 'Discount Value',
                        defaultValue: 0,
                        placeholder: '0.00',
                    },
                ],
            },
            // Step 3: Organization
            {
                title: 'Organization',
                description: 'Categorize the product.',
                fields: [
                    {
                        type: 'select',
                        name: 'brand_id',
                        label: 'Brand',
                        validation: { required: 'Brand is required.' },
                        // In a real app, you would fetch these from an API endpoint like '/api/v1/brands'
                        // and populate them dynamically.
                        options: [
                            { value: 1, label: 'Stylo' },
                            { value: 2, label: 'Denim Co.' },
                            { value: 3, label: 'Outdoor Pro' },
                            { value: 13, label: 'Page Turner Inc.' },
                        ],
                    },
                    {
                        type: 'select', // Assuming a multi-select component would be used here
                        name: 'category_ids', // The backend should expect an array of category IDs
                        label: 'Categories',
                        validation: { required: 'At least one category is required.' },
                        // These should also be fetched from '/api/v1/categories'
                        options: [
                            { value: 2, label: 'Fashion' },
                            { value: 3, label: 'Books' },
                            { value: 4, label: 'Mens Clothing' },
                            { value: 5, label: 'Womens Clothing' },
                        ],
                    },
                ],
            },
            // Step 4: Media
            {
                title: 'Product Images',
                description: 'Upload images for the product gallery.',
                fields: [
                    {
                        type: 'file',
                        name: 'images',
                        label: 'Product Images',
                        fileConfig: {
                            multiple: true,
                            accept: 'image/png, image/jpeg, image/webp',
                            preview: true,
                            async: true, // Set to true if you have a separate upload endpoint
                            url: '/products/images',
                            formKey: 'image',
                        },
                    },
                ],
            },
        ],
    },

    /**
     * Customizations for the "Add Product" flow.
     */
    addConfig: {
        modalTitle: 'Add a New Product',
        triggerButtonText: 'Add Product',
    },

    /**
     * Customizations for the "Edit Product" flow.
     */
    editConfig: {
        modalTitle: 'Edit Product',
        modalDescription: 'Update the details for this product.',
    },

    /**
     * Enable and configure the read-only "View" modal.
     */
    viewConfig: {
        modalTitle: 'Product Details',
    },

    /**
     * Customize the overall layout.
     */
    layoutConfig: {
        // Use a wider modal to better fit the multi-column form layout.
        modalClassName: 'md:max-w-screen-xl',
    },
};
