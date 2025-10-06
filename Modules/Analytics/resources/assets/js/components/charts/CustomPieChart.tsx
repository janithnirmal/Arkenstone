import { ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface CustomPieChartProps {
    data: any[];
    options: {
        title: string;
        description: string;
        chartConfig: any;
        dataKey: string;
        nameKey: string;
    };
}

export function CustomPieChart({ data, options }: CustomPieChartProps) {
    const { title, description, chartConfig, dataKey, nameKey } = options;

    return (
        <ChartContainer title={title} description={description} chartConfig={chartConfig}>
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={data} dataKey={dataKey} nameKey={nameKey} />
                <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
        </ChartContainer>
    );
}
