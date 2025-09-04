import { Stock } from '@/core/types';

export type StockByVariationOption = {
    stock_id: number;
    variation_option_name: string;
    variation_stock_id: number;
};

export function useFilterStockByVariationOption(stocks: Stock[]) {
    const data: { [key: string]: StockByVariationOption[] } = {};

    stocks.forEach((stock) => {
        stock.variation_stocks.forEach((variationStock) => {
            const key = variationStock.variation_option.variation.name;
            if (!data[key]) {
                data[key] = [];
            }

            if (data[key].length === 0 || data[key].some((item) => item.stock_id !== stock.id)) {
                data[key].push({
                    stock_id: stock.id,
                    variation_option_name: variationStock.variation_option.name,
                    variation_stock_id: variationStock.id,
                });
            }
        });
    });
    return data;
}
