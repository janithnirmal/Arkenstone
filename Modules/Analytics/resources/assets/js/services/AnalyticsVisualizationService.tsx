import { CustomBarChart } from '@analytics/components/charts/CustomBarChart';
import { CustomPieChart } from '@analytics/components/charts/CustomPieChart';
import React, { useEffect } from 'react';
import { CustomLineChart } from '../components/charts/CustomLineChart';
// Import other chart components here as you create them

// Map string keys to your chart components
const chartComponents: { [key: string]: React.ElementType } = {
    BarChart: CustomBarChart,
    PieChart: CustomPieChart,
    LineChart: CustomLineChart,
    // Add other chart components here
};

interface VisualizationMapping {
    [key: string]: {
        component: keyof typeof chartComponents;
        options: any;
    };
}

interface AnalyticsVisualizationServiceProps {
    data: { [key: string]: any };
    mapping: VisualizationMapping;
}

export function AnalyticsVisualizationService({ data, mapping }: AnalyticsVisualizationServiceProps) {
    useEffect(() => {
        console.log(data);
        console.log(mapping);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.keys(data).map((key) => {
                const mappingInfo = mapping[key];
                const chartData = data[key];

                if (!mappingInfo || !chartData) {
                    return null; // Or render a placeholder/error state
                }

                const ChartComponent = chartComponents[mappingInfo.component];

                if (!ChartComponent) {
                    console.warn(`[AnalyticsVisualizationService] No component found for type: ${mappingInfo.component}`);
                    return null;
                }

                return (
                    <div key={key}>
                        <ChartComponent data={chartData} options={mappingInfo.options} />
                    </div>
                );
            })}
        </div>
    );
}
