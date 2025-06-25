"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Users, Calendar, Briefcase, Percent } from "lucide-react";

const chartData = [
  { month: "January", sessions: 186 },
  { month: "February", sessions: 305 },
  { month: "March", sessions: 237 },
  { month: "April", sessions: 273 },
  { month: "May", sessions: 209 },
  { month: "June", sessions: 214 },
];

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-1))",
  },
};

const pieChartData = [
    { symptom: "Anxiety", value: 275, fill: "var(--color-anxiety)" },
    { symptom: "Depression", value: 200, fill: "var(--color-depression)" },
    { symptom: "Stress", value: 187, fill: "var(--color-stress)" },
    { symptom: "Sleep", value: 173, fill: "var(--color-sleep)" },
    { symptom: "Other", value: 90, fill: "var(--color-other)" },
]

const pieChartConfig = {
    value: {
      label: "Patients",
    },
    anxiety: {
      label: "Anxiety",
      color: "hsl(var(--chart-1))",
    },
    depression: {
      label: "Depression",
      color: "hsl(var(--chart-2))",
    },
    stress: {
      label: "Stress",
      color: "hsl(var(--chart-3))",
    },
    sleep: {
      label: "Sleep",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
}

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +1 since yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              3 urgent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Sessions per Month</CardTitle>
            <CardDescription>
              An overview of clinical sessions conducted monthly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="sessions" fill="var(--color-sessions)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Primary Symptoms Overview</CardTitle>
             <CardDescription>Distribution of primary symptoms across active patients.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-0">
             <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart>
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="symptom"
                    innerRadius={60}
                    strokeWidth={5}
                    />
                    <ChartLegend
                        content={<ChartLegendContent nameKey="symptom" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                </PieChart>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
