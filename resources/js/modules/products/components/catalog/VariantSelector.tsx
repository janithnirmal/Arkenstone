// resources/js/modules/products/components/catalog/VariantSelector.tsx

import React, { useMemo } from 'react';
import { Attribute, AttributeValue, Product } from '../../types';

interface GroupedAttribute extends Attribute {
    values: AttributeValue[];
}

interface Props {
    product: Product;
    selectedOptions: Record<string, string>; // e.g., { "Color": "Red", "Size": "M" }
    onOptionSelect: (attributeName: string, value: string) => void;
}

const VariantSelector: React.FC<Props> = ({ product, selectedOptions, onOptionSelect }) => {
    // The API gives us a flat list of attributes used by the product's variants.
    // We need to group them by their parent attribute (e.g., group "Red" and "Blue" under "Color").
    const groupedAttributes = useMemo(() => {
        const groups: Record<string, GroupedAttribute> = {};

        // This requires a more complex data structure from the API to be truly effective.
        // For this example, we'll assume a simplified structure or simulate it.
        // A better API would return `product.attributes` as an array of `Attribute` with their `values`.
        // Let's assume a placeholder structure for the UI.
        // In a real app, you would fetch all attributes and filter them.
        // For now, let's create a mock grouping.
        // THIS IS A SIMPLIFICATION and should be replaced with real data grouping.
        const mockAttributes: GroupedAttribute[] = [
            // This would be dynamically generated based on product data in a real app
        ];

        // If you had a proper `product.attributes` structure, the logic would be:
        // product.attributes.forEach(attr => { /* group them */ });

        return mockAttributes; // In a real scenario, this would be the result of the grouping logic
    }, [product]);

    // This is a placeholder. You would need to adjust this based on how your API provides attribute data.
    if (!product.attributes || product.attributes.length === 0) {
        return null;
    }
    
    // A more realistic, yet still simplified grouping logic:
    const simpleGrouped = product.attributes.reduce((acc, curr) => {
        // This assumes your API does not provide the parent attribute name directly on the attribute value
        // which is a limitation. A better API would include it.
        // Let's just create a dummy "Options" group for now.
        if (!acc['Options']) acc['Options'] = [];
        acc['Options'].push(curr);
        return acc;
    }, {} as Record<string, AttributeValue[]>);


    return (
        <div className="space-y-4">
            {Object.entries(simpleGrouped).map(([attributeName, values]) => (
                <div key={attributeName}>
                    <h3 className="text-sm font-medium text-gray-900">{attributeName}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {values.map(value => {
                            const isSelected = selectedOptions[attributeName] === value.value;
                            return (
                                <button
                                    key={value.id}
                                    onClick={() => onOptionSelect(attributeName, value.value)}
                                    className={`px-4 py-2 text-sm border rounded-md transition-colors
                                        ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100'}`}
                                >
                                    {value.value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VariantSelector;