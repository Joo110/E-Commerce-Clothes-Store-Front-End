// src/components/AppBarChart.tsx
"use client";

import { useMemo } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useOrderStats } from "@/hooks/useDashboard";

interface OrderStatsItem {
  month?: string;
  label?: string;
  total?: number;
  orders?: number;
  count?: number;
  successful?: number;
  paid?: number;
}

interface ChartDataItem {
  month: string;
  total: number;
  successful: number;
}

const AppBarChart = () => {
  const { data, isLoading, error } = useOrderStats();

  const chartData: ChartDataItem[] = useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data.map((item: OrderStatsItem) => ({
        month: item.month ?? item.label ?? "",
        total: Number(item.total ?? item.orders ?? item.count ?? 0),
        successful: Number(item.successful ?? item.paid ?? 0),
      }));
    }

    if (typeof data === "object" && data !== null) {
      const obj = data as OrderStatsItem;
      return [
        {
          month: "Total",
          total: Number(obj.total ?? obj.orders ?? obj.count ?? 0),
          successful: Number(obj.successful ?? obj.paid ?? 0),
        },
      ];
    }

    return [];
  }, [data]);

  if (isLoading) return <div>Loading chart...</div>;
  if (error) return <div>Failed to load chart</div>;

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Orders Overview</h1>
      <ChartContainer
        config={{
          total: { label: "Total" },
          successful: { label: "Successful" },
        }}
        className="min-h-[200px] w-full"
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(v) => String(v).slice(0, 3)}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          <Bar dataKey="successful" fill="var(--color-successful)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AppBarChart;