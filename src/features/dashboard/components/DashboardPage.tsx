"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/atoms/card";
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
} from "@/atoms/chart";
import { Users, Calendar, Briefcase, Percent } from "lucide-react";

const chartData = [
  { month: "Janeiro", sessions: 186 },
  { month: "Fevereiro", sessions: 305 },
  { month: "Março", sessions: 237 },
  { month: "Abril", sessions: 273 },
  { month: "Maio", sessions: 209 },
  { month: "Junho", sessions: 214 },
];

const chartConfig = {
  sessions: {
    label: "Sessões",
    color: "hsl(var(--chart-1))",
  },
};

const pieChartData = [
    { symptom: "Ansiedade", value: 275, fill: "var(--color-anxiety)" },
    { symptom: "Depressão", value: 200, fill: "var(--color-depression)" },
    { symptom: "Estresse", value: 187, fill: "var(--color-stress)" },
    { symptom: "Sono", value: 173, fill: "var(--color-sleep)" },
    { symptom: "Outro", value: 90, fill: "var(--color-other)" },
]

const pieChartConfig = {
    value: {
      label: "Pacientes",
    },
    anxiety: {
      label: "Ansiedade",
      color: "hsl(var(--chart-1))",
    },
    depression: {
      label: "Depressão",
      color: "hsl(var(--chart-2))",
    },
    stress: {
      label: "Estresse",
      color: "hsl(var(--chart-3))",
    },
    sleep: {
      label: "Sono",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Outro",
      color: "hsl(var(--chart-5))",
    },
}

export function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.234</div>
            <p className="text-xs text-muted-foreground">
              +20,1% desde o mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +1 desde ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Abertas</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              3 urgentes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground">
              +2% desde a semana passada
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Sessões por Mês</CardTitle>
            <CardDescription>
              Uma visão geral das sessões clínicas realizadas mensalmente.
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
            <CardTitle className="font-headline">Visão Geral dos Sintomas Primários</CardTitle>
             <CardDescription>Distribuição dos sintomas primários entre os pacientes ativos.</CardDescription>
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
