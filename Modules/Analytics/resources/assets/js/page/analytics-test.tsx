import { Head } from '@inertiajs/react';
import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { AnalyticsFilterMapping, useAnalyticsFilter } from '../hooks/useAnalyticsFilter';
import { analyticsTracker } from '../services/AnalyticsService';
import { AnalyticsVisualizationService } from '../services/AnalyticsVisualizationService';

const filterMapping: AnalyticsFilterMapping = {
    test_button_clicked: [
        {
            name: 'transformDateCountObject',
            options: { dateKey: 'date', valueKey: 'count' },
        },
        {
            name: 'padDateRange', // This will be applied second
            options: { dateKey: 'date', valueKey: 'count', defaultValue: 0 },
        },
    ],
    daily_user_logins: [
        {
            name: 'transformDateCountObject',
            options: { dateKey: 'date', valueKey: 'count' },
        },
        {
            name: 'padDateRange', // This will be applied second
            options: { dateKey: 'date', valueKey: 'count', defaultValue: 0 },
        },
    ],
};

// Example of the mapping configuration
const visualizationMapping = {
    test_button_clicked: {
        component: 'LineChart',
        options: {
            title: 'Button Clicked',
            description: 'A bar chart showing the number of user logins per day.',
            chartConfig: {
                count: {
                    label: 'Logins',
                    color: '#2563eb',
                },
            },
            xAxisKey: 'date',
            lineDataKeys: ['count'],
        },
    },
    daily_user_logins: {
        component: 'LineChart',
        options: {
            title: 'Daily User Logins',
            description: 'A bar chart showing the number of user logins per day.',
            chartConfig: {
                count: {
                    label: 'Logins',
                    color: '#2563eb',
                },
            },
            xAxisKey: 'date',
            lineDataKeys: ['count'],
        },
    },
};

export function AnalyticsTest() {
    const [refresh, setRefresh] = useState<boolean>(false);

    const [rawAnalyticsData, setRawAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    });

    // 3. Use the hook to process data
    const analyticsData = useAnalyticsFilter(rawAnalyticsData, filterMapping, {
        dateRange: date,
    });

    useEffect(() => {
        fetchData();
    }, [refresh]);

    async function fetchData() {
        setLoading(true);
        const data = await analyticsTracker.query([
            {
                key: 'test_button_clicked',
                type: 'system',
            },
            {
                key: 'daily_user_logins',
                type: 'system',
            },
        ]);
        console.log(data);

        setRawAnalyticsData(data);
        setLoading(false);
    }

    //     <section className="bg-background container mx-auto py-10">
    //         <JsonViewer data={data} />

    //         <hr />
    //         <Button
    //             onClick={() => {
    //                 analyticsTracker.trackSystem('test_button_clicked');
    //             }}
    //         >
    //             Test Button
    //         </Button>

    //         <Button
    //             onClick={() => {
    //                 setRefresh(!refresh);
    //             }}
    //         >
    //             Refresh
    //         </Button>
    //     </section>
    // );

    return (
        <section className="p-4">
            <Head title="Analytics" />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <DateRangeFilter date={date} setDate={setDate} />
            </div>

            {loading && <div>Loading...</div>}

            {!loading && analyticsData && <AnalyticsVisualizationService data={analyticsData} mapping={visualizationMapping} />}
        </section>
    );
}
