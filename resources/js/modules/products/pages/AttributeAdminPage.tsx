// resources/js/modules/products/pages/AttributeAdminPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { attributeService } from '../services/attributeService';
import { Attribute } from '../types';

const AttributeAdminPage: React.FC = () => {
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { register, handleSubmit, reset } = useForm<{ name: string }>();
    const { register: registerValue, handleSubmit: handleSubmitValue, reset: resetValue } = useForm<{ value: string }>();

    const fetchAttributes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await attributeService.getAttributes();
            setAttributes(data);
        } catch (error) {
            console.error("Failed to fetch attributes", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttributes();
    }, [fetchAttributes]);

    const onAttributeSubmit = async (data: { name: string }) => {
        try {
            await attributeService.createAttribute(data.name);
            reset({ name: '' });
            fetchAttributes();
        } catch (error) {
            console.error("Failed to create attribute", error);
        }
    };

    const onValueSubmit = async (attributeId: number, data: { value: string }) => {
        try {
            await attributeService.createAttributeValue(attributeId, data.value);
            resetValue({ value: '' }); // Consider a more robust reset for multiple forms
            fetchAttributes();
        } catch (error) {
            console.error("Failed to create attribute value", error);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl font-semibold text-gray-900">Manage Attributes</h1>
            <p className="mt-2 text-sm text-gray-700">Add or edit global attributes and their values (e.g., Color, Size).</p>

            {/* Form to Create New Attribute */}
            <div className="mt-6 max-w-md">
                <form onSubmit={handleSubmit(onAttributeSubmit)} className="flex items-center space-x-2">
                    <input
                        {...register('name', { required: true })}
                        placeholder="New Attribute Name (e.g., Material)"
                        className="block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    <button type="submit" className="btn-primary whitespace-nowrap">Add Attribute</button>
                </form>
            </div>

            {/* List of Existing Attributes */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? <p>Loading attributes...</p> : attributes.map(attr => (
                    <div key={attr.id} className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold text-gray-800">{attr.name}</h3>
                        <div className="mt-2 space-y-1">
                            {attr.values.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {attr.values.map(val => (
                                        <span key={val.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {val.value}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No values yet.</p>
                            )}
                        </div>
                        <form onSubmit={handleSubmitValue((data) => onValueSubmit(attr.id, data))} className="mt-4 flex items-center space-x-2">
                            <input
                                {...registerValue(`value_${attr.id}` as any, { required: true })}
                                placeholder="Add new value"
                                className="block w-full text-sm rounded-md border-gray-300 shadow-sm"
                            />
                            <button type="submit" className="btn-secondary text-sm whitespace-nowrap">Add</button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttributeAdminPage;