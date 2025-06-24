'use client';

import React from 'react';
import dynamic from 'next/dynamic';
const LineChart = dynamic(
  () => import('recharts').then((m) => m.LineChart as React.ComponentType<any>),
  { ssr: false }
);
const Line = dynamic(() => import('recharts').then((m) => m.Line as React.ComponentType<any>), {
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
  { month: 'Jan', sessions: 186 },
  { month: 'Fev', sessions: 305 },
  { month: 'Mar', sessions: 237 },
  { month: 'Abr', sessions: 273 },
  { month: 'Mai', sessions: 209 },
  { month: 'Jun', sessions: 314 },
];

const chartConfig = {
  sessions: {
    label: 'Sessões',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function SessionsTrendChart({ data = chartData }: { data?: typeof chartData }) {
  if (!data || data.length === 0) {
    return <p>Sem dados para exibir.</p>;
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] w-full h-full"
      role="img"
      aria-label="Tendência de sessões mensais"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -20, // Adjusted for YAxis labels
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // stroke="hsl(var(--muted-foreground))"
          />
          <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
          <Legend />
          <Line
            dataKey="sessions"
            type="monotone"
            stroke="var(--color-sessions)"
            strokeWidth={2}
            dot={{
              fill: 'var(--color-sessions)',
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
