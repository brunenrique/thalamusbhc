
"use client"

import React from "react"; // Added React import
import { Pie, PieChart, ResponsiveContainer, Cell, Label } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
  { problem: "Ansiedade", count: 275, fill: "var(--color-anxiety)" },
  { problem: "Depressão", count: 200, fill: "var(--color-depression)" },
  { problem: "Relacionamentos", count: 187, fill: "var(--color-relationships)" },
  { problem: "Estresse", count: 173, fill: "var(--color-stress)" },
  { problem: "Outros", count: 90, fill: "var(--color-others)" },
]

const chartConfig = {
  count: {
    label: "Casos",
  },
  anxiety: {
    label: "Ansiedade",
    color: "hsl(var(--chart-1))",
  },
  depression: {
    label: "Depressão",
    color: "hsl(var(--chart-2))",
  },
  relationships: {
    label: "Relacionamentos",
    color: "hsl(var(--chart-3))",
  },
  stress: {
    label: "Estresse",
    color: "hsl(var(--chart-4))",
  },
  others: {
    label: "Outros",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function ProblemDistributionChart({ data = chartData }: { data?: typeof chartData }) {
  if (!data || data.length === 0) {
    return <p>Sem dados para exibir.</p>;
  }

  const totalCases = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0)
  }, [data])

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart role="img" aria-label="Distribuição de problemas por tipo">
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="problem"
            innerRadius={60}
            strokeWidth={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
             <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalCases.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-muted-foreground text-sm"
                      >
                        Total Casos
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
           <ChartLegend content={<ChartLegendContent nameKey="problem" className="text-xs flex-wrap justify-center gap-x-2 gap-y-1" />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

