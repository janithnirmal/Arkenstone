import Button from '@/components/custom/button';
import { useEffect, useState } from 'react';
import JsonViewer from '../components/json-viewer';
import { analyticsTracker } from '../services/AnalyticsTrackerService';

export function AnalyticsTest() {
    const [data, setData] = useState<any>({});
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, [refresh]);

    async function fetchData() {
        const data = await analyticsTracker.query([
            {
                key: 'test_button_clicked',
                type: 'system',
            },
        ]);
        setData(data);
    }

    return (
        <section className="bg-background container mx-auto py-10">
            <JsonViewer data={data} />

            <hr />
            <Button
                onClick={() => {
                    analyticsTracker.trackSystem('test_button_clicked');
                }}
            >
                Test Button
            </Button>

            <Button
                onClick={() => {
                    setRefresh(!refresh);
                }}
            >
                Refresh
            </Button>
        </section>
    );
}
