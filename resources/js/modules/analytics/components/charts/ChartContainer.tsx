import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer as ShadcnChartContainer } from '@/components/ui/chart';
import { ReactElement } from 'react';

interface ChartContainerProps {
    title: string;
    description: string;
    chartConfig: ChartConfig;
    children: ReactElement;
}

export function ChartContainer({ title, description, chartConfig, children }: ChartContainerProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ShadcnChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    {children}
                </ShadcnChartContainer>
            </CardContent>
        </Card>
    );
}
