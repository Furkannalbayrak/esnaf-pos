"use client";

import { useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { useSales } from "@/hooks/use-sales";
import { ProductGrid } from "@/components/sales/product-grid";
import { ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function SatisPage() {
  const { products, categories, loading: productsLoading } = useProducts();
  const {
    fetchTodaySales,
    recordSale,
    undoLastSale,
    getTodayCount,
    loading: saleLoading,
  } = useSales();

  useEffect(() => {
    fetchTodaySales();
  }, [fetchTodaySales]);

  const handleTap = async (product: typeof products[0]) => {
    if (saleLoading) return;
    await recordSale(product);
  };

  const handleUndo = async (productId: string) => {
    await undoLastSale(productId);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <ShoppingCart className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Hızlı Satış</h1>
          <p className="text-xs text-muted-foreground">
            Ürüne dokunarak satış kaydedin
          </p>
        </div>
      </div>

      {/* Loading */}
      {productsLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">
            Ürünler yükleniyor...
          </p>
        </div>
      ) : (
        <ProductGrid
          products={products}
          categories={categories}
          getTodayCount={getTodayCount}
          onTap={handleTap}
          onUndo={handleUndo}
        />
      )}
    </div>
  );
}
