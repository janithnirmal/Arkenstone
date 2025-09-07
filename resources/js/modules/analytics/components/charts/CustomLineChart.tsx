import { ChartConfig, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface CustomLineChartProps {
    data: any[];
    options: {
        title: string;
        description: string;
        chartConfig: ChartConfig;
        xAxisKey: string;
        /** An array of keys from your data objects to render as lines. */
        lineDataKeys: string[];
    };
}

export function CustomLineChart({ data, options }: CustomLineChartProps) {
    const { title, description, chartConfig, xAxisKey, lineDataKeys } = options;

    return (
        <ChartContainer title={title} description={description} chartConfig={chartConfig}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={xAxisKey}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    // Example formatter for dates - you can customize this as needed
                    // tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <ChartLegend content={<ChartLegendContent />} />
                {/* This map allows rendering multiple lines on the same chart */}
                {lineDataKeys.map((key) => (
                    <Line key={key} dataKey={key} type="monotone" stroke={`var(--color-${key})`} strokeWidth={2} dot={true} />
                ))}
            </LineChart>
        </ChartContainer>
    );
}
