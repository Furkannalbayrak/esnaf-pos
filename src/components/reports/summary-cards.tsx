"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalSales: number;
}

export function SummaryCards({
  totalRevenue,
  totalCost,
  totalProfit,
  totalSales,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Toplam Ciro",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      gradient: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Toplam Maliyet",
      value: formatCurrency(totalCost),
      icon: ShoppingBag,
      gradient: "from-orange-500/20 to-orange-600/5",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/20",
    },
    {
      title: "Net Kâr",
      value: formatCurrency(totalProfit),
      icon: totalProfit >= 0 ? TrendingUp : TrendingDown,
      gradient:
        totalProfit >= 0
          ? "from-emerald-500/20 to-emerald-600/5"
          : "from-red-500/20 to-red-600/5",
      iconColor: totalProfit >= 0 ? "text-emerald-400" : "text-red-400",
      borderColor:
        totalProfit >= 0 ? "border-emerald-500/20" : "border-red-500/20",
    },
    {
      title: "Satılan Ürün",
      value: `${totalSales} adet`,
      icon: ShoppingBag,
      gradient: "from-purple-500/20 to-purple-600/5",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`rounded-2xl border ${card.borderColor} bg-linear-to-br ${card.gradient} p-4`}
          >
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${card.iconColor}`} />
              <span className="text-xs text-muted-foreground">
                {card.title}
              </span>
            </div>
            <p className="mt-2 text-lg font-bold sm:text-xl">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
