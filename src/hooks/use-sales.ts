"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Product, Sale } from "@/types/database";

export function useSales() {
  const [todaySales, setTodaySales] = useState<
    Map<string, { count: number; saleIds: string[] }>
  >(new Map());
  const [loading, setLoading] = useState(false);

  const fetchTodaySales = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("sales")
      .select("id, product_id, quantity")
      .gte("created_at", today.toISOString())
      .order("created_at", { ascending: false });

    if (!error && data) {
      const map = new Map<string, { count: number; saleIds: string[] }>();
      for (const sale of data as Sale[]) {
        const existing = map.get(sale.product_id) || {
          count: 0,
          saleIds: [],
        };
        existing.count += sale.quantity;
        existing.saleIds.push(sale.id);
        map.set(sale.product_id, existing);
      }
      setTodaySales(map);
    }
  }, []);

  const recordSale = async (product: Product) => {
    setLoading(true);
    const saleData = {
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      unit_price: product.sale_price,
      cost_price: product.cost_price,
      total_amount: product.sale_price,
      profit: product.sale_price - product.cost_price,
    };

    const { data, error } = await supabase
      .from("sales")
      .insert(saleData)
      .select()
      .single();

    if (!error && data) {
      const sale = data as Sale;
      setTodaySales((prev) => {
        const newMap = new Map(prev);
        const existing = newMap.get(product.id);
        
        newMap.set(product.id, {
          count: (existing?.count || 0) + 1,
          saleIds: [sale.id, ...(existing?.saleIds || [])],
        });
        
        return newMap;
      });
      setLoading(false);
      return { success: true, saleId: sale.id };
    }

    setLoading(false);
    return { success: false, error };
  };

  const undoLastSale = async (productId: string) => {
    const productSales = todaySales.get(productId);
    if (!productSales || productSales.saleIds.length === 0) return { success: false };

    const lastSaleId = productSales.saleIds[0];

    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", lastSaleId);

    if (!error) {
      setTodaySales((prev) => {
        const newMap = new Map(prev);
        const existing = newMap.get(productId);
        
        if (existing) {
          const newCount = existing.count - 1;
          const newSaleIds = existing.saleIds.slice(1);
          
          if (newCount <= 0) {
            newMap.delete(productId);
          } else {
            newMap.set(productId, { count: newCount, saleIds: newSaleIds });
          }
        }
        return newMap;
      });
      return { success: true };
    }
    return { success: false, error };
  };

  const getTodayCount = (productId: string): number => {
    return todaySales.get(productId)?.count || 0;
  };

  return {
    todaySales,
    loading,
    fetchTodaySales,
    recordSale,
    undoLastSale,
    getTodayCount,
  };
}
