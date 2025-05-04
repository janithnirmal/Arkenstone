import Button from '@/components/custom/button';
import { Product, Stock } from '@/core/types';
import { createContext, useState } from 'react';
import QuantitySelector from './quantity-selector.tsx/default-quantity-selector';
import StockSelector from './stock-selector/default-stock-selector';
import { StockByVariationOption } from './stock-selector/hooks/use-filter-stock-by-variation-option';
import Config from '@/core/config';

export type ProductSelectorContext = {
    quantity: number;
    setQuantity: (quantity: number) => void;
    stock: Stock | null;
    setStock: (stock: Stock) => void;

    selectedVariationOptions: { [key: string]: StockByVariationOption[] };
    setSelectedVariationOptions: (variationOptions: { [key: string]: StockByVariationOption[] }) => void;
};

export const ProductSelectorContext = createContext<ProductSelectorContext>({
    quantity: 1,
    setQuantity: () => {},
    stock: null,
    setStock: () => {},

    selectedVariationOptions: {},
    setSelectedVariationOptions: () => {},
});

export default function ProductSelector({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState<number>(1);
    const [stock, setStock] = useState<Stock | null>(null);
    const [selectedVariationOptions, setSelectedVariationOptions] = useState<{ [key: string]: StockByVariationOption[] }>({});

    return (
        <ProductSelectorContext.Provider value={{ quantity, setQuantity, stock, setStock, selectedVariationOptions, setSelectedVariationOptions }}>
            <StockSelector stocks={product.stocks ?? []} />
            <QuantitySelector />
            <Button
                onClick={() => {
                    const variationOptions = Object.values(selectedVariationOptions)
                        .map((option) => option.map((o) => o.variation_option_name).join(', '))
                        .join(' And ');
                    const quantityMessage = quantity === 1 ? '1 item' : `${quantity} items`;
                    const message = `I want to buy ${quantityMessage} of ${product.name} in ${variationOptions}`;

                    window.open(`https://wa.me/${Config.seller.whatsapp}?text=${message}`, '_blank');
                }}
                disabled={Object.keys(selectedVariationOptions).length === 0}
                variant="primary"
            >
                Add to Cart
            </Button>
        </ProductSelectorContext.Provider>
    );
}
