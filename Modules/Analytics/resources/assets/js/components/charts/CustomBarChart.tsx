import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface CustomBarChartProps {
    data: any[];
    options: {
        title: string;
        description: string;
        chartConfig: any;
        xAxisKey: string;
        barDataKey: string;
    };
}

export function CustomBarChart({ data, options }: CustomBarChartProps) {
    const { title, description, chartConfig, xAxisKey, barDataKey } = options;

    return (
        <ChartContainer title={title} description={description} chartConfig={chartConfig}>
            <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={xAxisKey} tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey={barDataKey} fill="var(--chart-3)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
