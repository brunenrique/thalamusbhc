
"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", sessions: 186 },
  { month: "Fev", sessions: 305 },
  { month: "Mar", sessions: 237 },
  { month: "Abr", sessions: 273 },
  { month: "Mai", sessions: 209 },
  { month: "Jun", sessions: 314 },
];

const chartConfig = {
  sessions: {
    label: "Sessões",
    color: "hsl(var(--chart-1))",
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
          <ChartTooltip
            cursor={true}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Legend />
          <Line
            dataKey="sessions"
            type="monotone"
            stroke="var(--color-sessions)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-sessions)",
              r: 4,
            }}
            activeDot={{
              r:6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
