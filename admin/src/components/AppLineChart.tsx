// src/components/AppLineChart.tsx
"use client";

import { useMemo } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMonthlyRevenue } from "@/hooks/useDashboard";

interface MonthlyRevenueItem {
  month?: string;
  label?: string;
  name?: string;
  revenue?: number;
  total?: number;
  value?: number;
  orders?: number;
  count?: number;
}

interface ChartDataItem {
  month: string;
  seriesA: number;
  seriesB: number;
}

const AppLineChart = () => {
  const { data, isLoading, error } = useMonthlyRevenue();

  const chartData: ChartDataItem[] = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item: MonthlyRevenueItem) => ({
      month: item.month ?? item.label ?? item.name ?? "",
      seriesA: Number(item.revenue ?? item.total ?? item.value ?? 0),
      seriesB: Number(item.orders ?? item.count ?? 0),
    }));
  }, [data]);

  if (isLoading) return <div>Loading chart...</div>;
  if (error) return <div>Failed to load chart</div>;

  return (
    <ChartContainer config={{}} className="mt-6">
      <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line dataKey="seriesA" type="monotone" stroke="var(--color-1)" strokeWidth={2} dot={false} />
        <Line dataKey="seriesB" type="monotone" stroke="var(--color-2)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
};

export default AppLineChart;