'use client';

import React from 'react';
import dynamic from 'next/dynamic';
const BarChart = dynamic(
  () => import('recharts').then((m) => m.BarChart as React.ComponentType<any>),
  { ssr: false }
);
const Bar = dynamic(() => import('recharts').then((m) => m.Bar as React.ComponentType<any>), {
  ssr: false,
});
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis as React.ComponentType<any>), {
  ssr: false,
});
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis as React.ComponentType<any>), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import('recharts').then((m) => m.CartesianGrid as React.ComponentType<any>),
  { ssr: false }
);
const Legend = dynamic(() => import('recharts').then((m) => m.Legend as React.ComponentType<any>), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer as React.ComponentType<any>),
  { ssr: false }
);
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Booked Slots',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Available Slots',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function OccupancyChart({ data = chartData }: { data?: typeof chartData }) {
  if (!data || data.length === 0) {
    return <p>Sem dados para exibir.</p>;
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] w-full h-[300px]"
      role="img"
      aria-label="Gráfico de ocupação de salas"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            // stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            // stroke="hsl(var(--muted-foreground))"
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          <Legend />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
