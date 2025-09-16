// resources/js/modules/products/components/product-admin/VariantManager.tsx

import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { attributeService } from '../../services/attributeService';
import { productService } from '../../services/productService';
import { Attribute, Product, ProductVariant } from '../../types';

interface Props {
    product: Product;
    onVariantsChange: () => void; // Callback to refresh product data
}

type VariantFormValues = {
    variants: ProductVariant[];
};

const VariantManager: React.FC<Props> = ({ product, onVariantsChange }) => {
    const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Attribute[]>([]);
    
    const { control, reset, getValues } = useForm<VariantFormValues>({
        defaultValues: { variants: product.variants || [] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'variants',
    });

    useEffect(() => {
        reset({ variants: product.variants });
    }, [product.variants, reset]);

    useEffect(() => {
        attributeService.getAttributes().then(setAllAttributes);
    }, []);

    const handleAttributeToggle = (attribute: Attribute) => {
        setSelectedAttributes(prev =>
            prev.find(a => a.id === attribute.id)
                ? prev.filter(a => a.id !== attribute.id)
                : [...prev, attribute]
        );
    };

    const generateVariants = () => {
        if (selectedAttributes.length === 0) return;

        const cartesian = (...a: any[][]) => a.reduce((acc, val) => acc.flatMap(d => val.map(e => [d, e].flat())));
        
        const valueArrays = selectedAttributes.map(attr => attr.values);
        const combinations = cartesian(...valueArrays);

        const newVariants = combinations.map(combo => {
            const name = Array.isArray(combo) ? combo.map(v => v.value).join(' / ') : combo.value;
            const existing = product.variants.find(v => v.name === name);
            
            return existing || {
                name,
                product_id: product.id,
                sku: `${product.sku}-${name.replace(/\s/g, '')}`,
                price: product.price,
                stock: 0,
            };
        });

        // This approach is fine for now, it replaces the entire variant list
        const currentLength = getValues('variants').length;
        for (let i = currentLength - 1; i >= 0; i--) {
            remove(i);
        }
        newVariants.forEach(v => append(v as ProductVariant));
    };

    const onSaveVariant = async (index: number, variantData: ProductVariant) => {
        try {
            if (variantData.id) {
                await productService.updateVariant(variantData.id, variantData);
            } else {
                await productService.createVariant(product.id, variantData);
            }
            onVariantsChange();
        } catch (err) {
            console.error("Failed to save variant", err);
        }
    };
    
    const onDeleteVariant = async (index: number, variantId?: number) => {
        if (variantId && window.confirm('Are you sure you want to delete this variant?')) {
            try {
                await productService.deleteVariant(variantId);
                remove(index);
                onVariantsChange();
            } catch(err) {
                 console.error("Failed to delete variant", err);
            }
        } else {
             remove(index);
        }
    }

    return (
        <div className="space-y-6 pt-4 border-t">
            <div>
                <h3 className="font-medium text-gray-800">1. Select Attributes for Variants</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {allAttributes.map(attr => (
                        <button
                            key={attr.id}
                            type="button"
                            onClick={() => handleAttributeToggle(attr)}
                            className={`px-3 py-1 text-sm rounded-full border ${selectedAttributes.find(a => a.id === attr.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100'}`}
                        >
                            {attr.name}
                        </button>
                    ))}
                </div>
            </div>

            {selectedAttributes.length > 0 && (
                <div>
                     <h3 className="font-medium text-gray-800">2. Generate Variants</h3>
                    <p className="text-sm text-gray-600">This will create all possible combinations from the selected attributes.</p>
                    <button type="button" onClick={generateVariants} className="btn-secondary mt-2">Generate Combinations</button>
                </div>
            )}
            
            <div>
                <h3 className="font-medium text-gray-800">3. Edit Variants</h3>
                <div className="mt-2 space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-md">
                            <div className="col-span-3">
                                <label className="text-sm font-medium text-gray-900">{field.name}</label>
                            </div>
                             <div className="col-span-2">
                                <input {...control.register(`variants.${index}.sku`)} placeholder="SKU" className="input-sm w-full" />
                            </div>
                            <div className="col-span-2">
                                <input {...control.register(`variants.${index}.price`)} type="number" step="0.01" placeholder="Price" className="input-sm w-full" />
                            </div>
                             <div className="col-span-2">
                                <input {...control.register(`variants.${index}.stock`)} type="number" placeholder="Stock" className="input-sm w-full" />
                            </div>
                            <div className="col-span-3 text-right space-x-2">
                                <button type="button" onClick={() => onSaveVariant(index, getValues(`variants.${index}`))} className="text-sm font-medium text-blue-600 hover:text-blue-800">Save</button>
                                <button type="button" onClick={() => onDeleteVariant(index, field.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                 {fields.length === 0 && <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">No variants created yet.</p>}
            </div>
        </div>
    );
};

export default VariantManager;