
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SessionData {
  name: string;
  sessions: number;
}

interface SessionsPerPsychologistChartProps {
  data: SessionData[];
}

const chartConfig = {
  sessions: {
    label: "Sessões",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function SessionsPerPsychologistChart({ data }: SessionsPerPsychologistChartProps) {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Nenhuma sessão registrada.
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 20,
            left: 20, // Increased left margin for YAxis labels
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={80} // Adjust width based on label length
          />
          <ChartTooltip
            cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Legend />
          <Bar
            dataKey="sessions"
            fill="var(--color-sessions)"
            radius={[0, 4, 4, 0]} // Rounded corners on one side for vertical bars
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
