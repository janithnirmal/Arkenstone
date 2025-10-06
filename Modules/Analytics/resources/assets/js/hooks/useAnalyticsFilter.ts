import { AnalyticsFilterName, analyticsFilters } from '@analytics/lib/analyticsFilters';
import { useMemo } from 'react';

export interface FilterConfig {
    name: AnalyticsFilterName;
    options?: any;
}

export interface AnalyticsFilterMapping {
    [dataKey: string]: FilterConfig[];
}

/**
 * A custom hook to process raw analytics data based on a declarative mapping.
 * It iterates through all keys in the `mapping` object and applies the specified
 * filter chains to the corresponding keys in the `rawData`.
 *
 * @param rawData The raw data object from the API.
 * @param mapping A configuration object mapping data keys to filter chains.
 * @param globalOptions Global options (like dateRange) available to all filters.
 * @returns The processed data ready for visualization, or null.
 */
export function useAnalyticsFilter(
    rawData: { [key: string]: any } | null,
    mapping: AnalyticsFilterMapping,
    globalOptions: { dateRange?: { from?: Date; to?: Date } } = {},
) {
    return useMemo(() => {
        // Early exit if there's no data to process.
        if (!rawData || typeof rawData !== 'object') {
            return null;
        }

        // Create a shallow copy of the raw data to avoid mutating the original state.
        const processedData = { ...rawData };

        // This loop is the key: it iterates over every entry you define in your `filterMapping`.
        // For your example, it will run for 'test_button_clicked' and then for 'daily_user_logins'.
        for (const dataKey in mapping) {
            // Use a safe check to ensure the key exists in both the mapping and the raw data.
            if (Object.prototype.hasOwnProperty.call(processedData, dataKey)) {
                const filtersToApply = mapping[dataKey];
                let currentData = processedData[dataKey]; // The data to be transformed (e.g., the object of dates)

                // Apply the specified chain of filters for this specific data key.
                for (const filterConfig of filtersToApply) {
                    const filterFn = analyticsFilters[filterConfig.name];
                    if (filterFn) {
                        try {
                            // Combine global options (like dateRange) with filter-specific options.
                            const options = { ...globalOptions, ...filterConfig.options };
                            // Overwrite `currentData` with the result of the transformation.
                            currentData = filterFn(currentData, options);
                        } catch (error) {
                            console.error(`[useAnalyticsFilter] Error applying filter "${filterConfig.name}" to data key "${dataKey}":`, error);
                            // Stop processing this key's filter chain if an error occurs.
                            break;
                        }
                    } else {
                        console.warn(`[useAnalyticsFilter] Filter "${filterConfig.name}" not found.`);
                    }
                }

                // Update the property in our copied object with the fully transformed data.
                processedData[dataKey] = currentData;
            }
        }

        return processedData;
    }, [rawData, mapping, globalOptions]); // The memoization ensures this logic only re-runs when data or options change.
}
