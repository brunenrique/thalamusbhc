
"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartConfig, ChartContainer, ChartTooltip as RechartsChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CardHeader, CardTitle, CardDescription, Card } from '@/components/ui/card'; // Added Card imports

interface ProgressDataPoint {
  date: Date;
  score: number;
}

interface PatientProgressChartProps {
  data: ProgressDataPoint[];
  instrumentName: string;
}

const chartConfig = (instrumentName: string): ChartConfig => ({
  score: {
    label: instrumentName,
    color: "hsl(var(--chart-1))",
  },
});


function PatientProgressChartComponent({ data, instrumentName }: PatientProgressChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground py-10">Nenhum dado de progresso disponível para este instrumento.</p>;
  }

  const formattedData = React.useMemo(() => data.map(item => ({
    ...item,
    formattedDate: format(item.date, "dd/MM", { locale: ptBR }),
  })), [data]);

  const config = React.useMemo(() => chartConfig(instrumentName), [instrumentName]);

  return (
    // Removed Card wrapper from here as it's part of the parent page.
    // If this component were to be used standalone with a Card, it would be:
    // <Card>
    //   <CardHeader>
    //     <CardTitle className="font-headline">Progresso: {instrumentName}</CardTitle>
    //     <CardDescription>Evolução das pontuações ao longo do tempo.</CardDescription>
    //   </CardHeader>
    //   <CardContent className="h-[300px] p-0"> {/* Adjust height as needed */}
    <ChartContainer config={config} className="min-h-[200px] w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={['auto', 'auto']}
          />
          <RechartsChartTooltip
            cursor={true}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const originalDataPoint = data.find(d => format(d.date, "dd/MM", {locale: ptBR}) === label);
                const displayLabel = originalDataPoint ? format(originalDataPoint.date, "P", {locale: ptBR}) : label;
                return (
                  <ChartTooltipContent
                    label={displayLabel}
                    payload={payload}
                    indicator="line"
                  />
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--color-score)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-score)",
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
            name={instrumentName}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
    //   </CardContent>
    // </Card>
  );
}

const PatientProgressChart = React.memo(PatientProgressChartComponent);
export default PatientProgressChart;
