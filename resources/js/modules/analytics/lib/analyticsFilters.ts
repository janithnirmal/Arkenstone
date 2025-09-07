import { eachDayOfInterval, format, startOfDay } from 'date-fns';

/**
 * Transforms an object of { "date": count } into an array of { dateKey: "date", valueKey: count }.
 * @param data The raw object data.
 * @param options Configuration for the output key names.
 */
export const transformDateCountObject = (data: { [key: string]: number }, options?: { dateKey?: string; valueKey?: string }) => {
    const dateKey = options?.dateKey || 'date';
    const valueKey = options?.valueKey || 'count';

    return Object.entries(data).map(([date, value]) => ({
        [dateKey]: date,
        [valueKey]: value,
    }));
};

/**
 * Ensures a continuous timeline by filling in missing dates with a default value (e.g., 0).
 * @param data The transformed data array (must contain a date key).
 * @param options Configuration including the date range, keys, and default value.
 */
export const padDateRange = (
    data: any[],
    options: {
        dateRange: { from: Date; to: Date };
        dateKey: string;
        valueKey: string;
        defaultValue?: number;
    },
) => {
    const { dateRange, dateKey, valueKey, defaultValue = 0 } = options;
    if (!dateRange.from || !dateRange.to) return data;

    const allDays = eachDayOfInterval({
        start: startOfDay(dateRange.from),
        end: startOfDay(dateRange.to),
    });

    const dataMap = new Map(data.map((item) => [format(startOfDay(new Date(item[dateKey])), 'yyyy-MM-dd'), item]));

    return allDays.map((day) => {
        const formattedDay = format(day, 'yyyy-MM-dd');
        const existingData = dataMap.get(formattedDay);

        if (existingData) {
            return existingData;
        }

        return {
            [dateKey]: formattedDay,
            [valueKey]: defaultValue,
        };
    });
};

// Register of all available filter functions
export const analyticsFilters = {
    transformDateCountObject,
    padDateRange,
};

export type AnalyticsFilterName = keyof typeof analyticsFilters;
