"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { psychologist: "Dr. Smith", sessions: 275, fill: "var(--color-smith)" },
  { psychologist: "Dr. Jones", sessions: 200, fill: "var(--color-jones)" },
  { psychologist: "Dr. Eva", sessions: 187, fill: "var(--color-eva)" },
  { psychologist: "Dr. Max", sessions: 173, fill: "var(--color-max)" },
  { psychologist: "Others", sessions: 90, fill: "var(--color-others)" },
]

const chartConfig = {
  sessions: {
    label: "Sessions",
  },
  smith: {
    label: "Dr. Smith",
    color: "hsl(var(--chart-1))",
  },
  jones: {
    label: "Dr. Jones",
    color: "hsl(var(--chart-2))",
  },
  eva: {
    label: "Dr. Eva",
    color: "hsl(var(--chart-3))",
  },
  max: {
    label: "Dr. Max",
    color: "hsl(var(--chart-4))",
  },
  others: {
    label: "Others",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function PerformanceChart({ data = chartData }: { data?: typeof chartData }) {
  if (!data || data.length === 0) {
    return <p>Sem dados para exibir.</p>;
  }

  return (
     <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px]"
        role="img"
        aria-label="Distribuição de sessões por profissional"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="sessions"
            nameKey="psychologist"
            innerRadius={60}
            strokeWidth={5}
            // activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            //   <Sector {...props} outerRadius={outerRadius + 10} />
            // )}
          >
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
                        {chartData.reduce((acc, curr) => acc + curr.sessions, 0).toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Sessions
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
  )
}
