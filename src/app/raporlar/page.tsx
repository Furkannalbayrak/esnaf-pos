"use client";

import { useEffect, useState } from "react";
import { useReports } from "@/hooks/use-reports";
import { SummaryCards } from "@/components/reports/summary-cards";
import { RevenueChart } from "@/components/reports/revenue-chart";
import { ProductTable } from "@/components/reports/product-table";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/types/database";

const tabs: { value: DateRange; label: string }[] = [
  { value: "daily", label: "Bugün" },
  { value: "weekly", label: "Bu Hafta" },
  { value: "monthly", label: "Bu Ay" },
];

export default function RaporlarPage() {
  const [activeRange, setActiveRange] = useState<DateRange>("daily");
  const { summary, productBreakdown, dailyData, loading, fetchReport } =
    useReports();

  useEffect(() => {
    fetchReport(activeRange);
  }, [activeRange, fetchReport]);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
          <BarChart3 className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Raporlar & Bilanço</h1>
          <p className="text-xs text-muted-foreground">
            Satış performansınızı takip edin
          </p>
        </div>
      </div>

      {/* Date Range Tabs */}
      <div className="mb-6 flex rounded-xl bg-secondary p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveRange(tab.value)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              activeRange === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">
            Rapor yükleniyor...
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <SummaryCards
            totalRevenue={summary.totalRevenue}
            totalCost={summary.totalCost}
            totalProfit={summary.totalProfit}
            totalSales={summary.totalSales}
          />

          <ProductTable data={productBreakdown} />

          <RevenueChart data={dailyData} />
        </div>
      )}
    </div>
  );
}
