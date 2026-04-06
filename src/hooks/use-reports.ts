"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";
import { tr } from "date-fns/locale";
import type {
  DateRange,
  ProductSalesReport,
  DailySalesData,
} from "@/types/database";

export function useReports() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    totalSales: 0,
  });
  const [productBreakdown, setProductBreakdown] = useState<
    ProductSalesReport[]
  >([]);
  const [dailyData, setDailyData] = useState<DailySalesData[]>([]);
  const [loading, setLoading] = useState(false);

  const getDateRange = (range: DateRange) => {
    const now = new Date();
    switch (range) {
      case "daily":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "weekly":
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        };
      case "monthly":
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const fetchReport = useCallback(async (range: DateRange) => {
    setLoading(true);
    const { start, end } = getDateRange(range);

    const { data: salesData, error } = await supabase
      .from("sales")
      .select(
        `
        id,
        product_id,
        quantity,
        unit_price,
        cost_price,
        total_amount,
        profit,
        created_at,
        products (name, category)
      `
      )
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: true });

    if (error || !salesData) {
      setLoading(false);
      return;
    }

    // Summary
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    let totalSales = 0;

    // Product breakdown map
    const productMap = new Map<string, ProductSalesReport>();

    // Daily data map
    const dayMap = new Map<
      string,
      { revenue: number; cost: number; profit: number; count: number }
    >();

    // Initialize days
    const days = eachDayOfInterval({ start, end });
    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");
      dayMap.set(key, { revenue: 0, cost: 0, profit: 0, count: 0 });
    }

    for (const sale of salesData) {
      const qty = sale.quantity;
      const revenue = sale.total_amount;
      const cost = sale.cost_price * qty;
      const profit = sale.profit;

      totalRevenue += revenue;
      totalCost += cost;
      totalProfit += profit;
      totalSales += qty;

      // Product breakdown
      const product = sale.products as unknown as {
        name: string;
        category: string;
      };
      const existing = productMap.get(sale.product_id);
      if (existing) {
        existing.total_quantity += qty;
        existing.total_revenue += revenue;
        existing.total_cost += cost;
        existing.total_profit += profit;
      } else {
        productMap.set(sale.product_id, {
          product_id: sale.product_id,
          product_name: product?.name || "Bilinmeyen",
          category: product?.category || "Genel",
          total_quantity: qty,
          total_revenue: revenue,
          total_cost: cost,
          total_profit: profit,
        });
      }

      // Daily
      const dayKey = format(new Date(sale.created_at), "yyyy-MM-dd");
      const dayData = dayMap.get(dayKey);
      if (dayData) {
        dayData.revenue += revenue;
        dayData.cost += cost;
        dayData.profit += profit;
        dayData.count += qty;
      }
    }

    setSummary({ totalRevenue, totalCost, totalProfit, totalSales });
    setProductBreakdown(
      Array.from(productMap.values()).sort(
        (a, b) => b.total_quantity - a.total_quantity
      )
    );
    setDailyData(
      Array.from(dayMap.entries()).map(([date, data]) => ({
        date: format(new Date(date), "dd MMM", { locale: tr }),
        ...data,
      }))
    );

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    summary,
    productBreakdown,
    dailyData,
    loading,
    fetchReport,
  };
}
