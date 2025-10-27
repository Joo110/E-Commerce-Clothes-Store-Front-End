// src/components/AppPieChart.tsx
"use client";

import { useMemo } from "react";
import { PieChart, Pie, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTopProducts } from "@/hooks/useDashboard";

const COLORS = [
  "var(--color-1)",
  "var(--color-2)",
  "var(--color-3)",
  "var(--color-4)",
  "var(--color-5)",
];

interface TopProductItem {
  id?: string | number;
  _id?: string;
  name?: string;
  productName?: string;
  title?: string;
  sales?: number;
  quantity?: number;
  revenue?: number;
  count?: number;
  score?: number;
  color?: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

const AppPieChart = () => {
  const { data, isLoading, error } = useTopProducts();

  const chartData: ChartDataItem[] = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((p: TopProductItem, idx: number) => ({
      name:
        p.name ??
        p.productName ??
        p.title ??
        String(p.id ?? p._id ?? `#${idx + 1}`),
      value: Number(p.sales ?? p.quantity ?? p.revenue ?? p.count ?? p.score ?? 0),
      fill: p.color ?? COLORS[idx % COLORS.length],
    }));
  }, [data]);

  const total = chartData.reduce((s, i) => s + i.value, 0);

  if (isLoading) return <div>Loading chart...</div>;
  if (error) return <div>Failed to load chart</div>;

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Top Products</h1>
      <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
            <Label
  content={({ viewBox }) => {
    // ✅ عرّف type للـ viewBox
    const { cx, cy } = viewBox as { cx: number; cy: number };

    if (typeof cx !== "number" || typeof cy !== "number") {
      return null;
    }

    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} y={cy} className="fill-foreground text-3xl font-bold">
          {total.toLocaleString()}
        </tspan>
        <tspan x={cx} y={cy + 24} className="fill-muted-foreground">
          Total
        </tspan>
      </text>
    );
  }}
/>

          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-4 flex flex-col gap-2 items-center">
        <div className="leading-none text-muted-foreground">Top selling products</div>
      </div>
    </div>
  );
};

export default AppPieChart;