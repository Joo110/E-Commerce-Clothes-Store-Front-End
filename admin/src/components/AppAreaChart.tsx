// src/components/AppAreaChart.tsx
"use client";

import { useMemo } from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import { useMonthlyRevenue } from "@/hooks/useDashboard";

// نوع البيانات اللي بترجع من الـ API
interface MonthlyRevenueItem {
  month?: string;
  name?: string;
  label?: string;
  date?: string;
  revenue?: number;
  total?: number;
  value?: number;
  orders?: number;
  count?: number;
  transactions?: number;
}

// النوع النهائي اللي هيستخدمه Recharts
interface ChartDataItem {
  month: string;
  seriesA: number;
  seriesB: number;
}

const chartConfig = {
  seriesA: { label: "Revenue", color: "var(--chart-1)" },
  seriesB: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig;

const AppAreaChart = () => {
  const { data, isLoading, error } = useMonthlyRevenue();

  // Map API response -> شكل يناسب recharts
  const chartData: ChartDataItem[] = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item: MonthlyRevenueItem) => {
      return {
        month:
          item.month ??
          item.name ??
          item.label ??
          (item.date ? new Date(item.date).toLocaleString(undefined, { month: "short" }) : ""),
        seriesA: Number(item.revenue ?? item.total ?? item.value ?? 0),
        seriesB: Number(item.orders ?? item.count ?? item.transactions ?? 0),
      };
    });
  }, [data]);

  if (isLoading) return <div>Loading chart...</div>;
  if (error) return <div>Failed to load chart</div>;

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Monthly Overview</h1>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <defs>
            <linearGradient id="fillA" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--color-1)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-1)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillB" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--color-2)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-2)" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <Area dataKey="seriesB" type="natural" fill="url(#fillB)" stroke="var(--color-2)" stackId="a" />
          <Area dataKey="seriesA" type="natural" fill="url(#fillA)" stroke="var(--color-1)" stackId="a" />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default AppAreaChart;