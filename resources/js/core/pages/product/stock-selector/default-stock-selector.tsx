import { Stock } from '@/core/types';
import { useContext, useEffect, useState } from 'react';
import { ProductSelectorContext } from '../product-selector';
import { StockByVariationOption, useFilterStockByVariationOption } from './hooks/use-filter-stock-by-variation-option';

export const DefaultStockSelector = ({ stocks }: { stocks: Stock[] }) => {
    const filteredStocks = useFilterStockByVariationOption(stocks);

    return (
        <div>
            {Object.keys(filteredStocks).map((stock) => (
                <div key={stock} className='my-3'>
                    <p className="text-sm font-bold">{stock}</p>
                    <div className="mt-2 flex gap-2">
                        <DefaultStockSelector.Variation filteredStocks={filteredStocks} stock={stock} />
                    </div>
                </div>
            ))}
        </div>
    );
};

DefaultStockSelector.Variation = ({ filteredStocks, stock }: { filteredStocks: any; stock: string }) => {
    const [selectedVariationOption, setSelectedVariationOption] = useState<StockByVariationOption | null>(null);

    const { selectedVariationOptions, setSelectedVariationOptions } = useContext(ProductSelectorContext);

    useEffect(() => {
        if (selectedVariationOption) {
            setSelectedVariationOptions({ ...selectedVariationOptions, [stock]: [selectedVariationOption] });
        }
    }, [selectedVariationOption]);

    return (
        <div className="flex gap-1">
            {filteredStocks[stock].map((item: StockByVariationOption) => (
                <DefaultStockSelector.VariationOption
                    key={item.stock_id}
                    item={item}
                    selectedVariationOption={selectedVariationOption}
                    setSelectedVariationOption={setSelectedVariationOption}
                />
            ))}
        </div>
    );
};

DefaultStockSelector.VariationOption = ({
    item,
    selectedVariationOption,
    setSelectedVariationOption,
}: {
    item: StockByVariationOption;
    selectedVariationOption: StockByVariationOption | null;
    setSelectedVariationOption: (variation: StockByVariationOption) => void;
}) => {
    return (
        <div
            data-stock-id={item.stock_id}
            className={`text-foreground w-max rounded-full px-3 py-1 text-sm ${selectedVariationOption?.variation_option_name === item.variation_option_name ? 'bg-accent' : 'border bg-transparent'}`}
            onClick={() => setSelectedVariationOption(item)}
        >
            {item.variation_option_name}
        </div>
    );
};

export default DefaultStockSelector;
