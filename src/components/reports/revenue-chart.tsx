"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DailySalesData } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: DailySalesData[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Grafik için veri bulunamadı
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold">Ciro & Kâr Grafiği</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#d1d5db" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#d1d5db" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          />
          <Bar
            dataKey="revenue"
            name="Ciro"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="profit"
            name="Kâr"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
