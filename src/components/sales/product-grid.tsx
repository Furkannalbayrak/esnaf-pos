"use client";

import { useState } from "react";
import { Minus, Package } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/database";

interface ProductGridProps {
  products: Product[];
  categories: string[];
  getTodayCount: (productId: string) => number;
  onTap: (product: Product) => void;
  onUndo: (productId: string) => void;
}

export function ProductGrid({
  products,
  categories,
  getTodayCount,
  onTap,
  onUndo,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <div className="flex flex-col gap-4">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
            activeCategory === null
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          )}
        >
          Tümü
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeCategory === cat
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => {
          const count = getTodayCount(product.id);
          return (
            <ProductCard
              key={product.id}
              product={product}
              count={count}
              onTap={onTap}
              onUndo={onUndo}
            />
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Package className="mb-3 h-12 w-12 opacity-30" />
          <p className="text-lg font-medium">Ürün bulunamadı</p>
          <p className="text-sm">Önce ürün ekleyin</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  count,
  onTap,
  onUndo,
}: {
  product: Product;
  count: number;
  onTap: (product: Product) => void;
  onUndo: (productId: string) => void;
}) {
  const [animating, setAnimating] = useState(false);

  const handleTap = () => {
    setAnimating(true);
    onTap(product);
    setTimeout(() => setAnimating(false), 150);
  };

  return (
    <div className="relative aspect-[4/5] w-full">
      <button
        onClick={handleTap}
        className={cn(
          "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-secondary transition-all duration-100 active:scale-95",
          animating && "scale-95 ring-4 ring-emerald-500/50"
        )}
      >
        {/* Full size image background */}
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <Package className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Text Area (at the bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
          <span className="line-clamp-1 block text-sm font-bold text-white shadow-black drop-shadow-md sm:text-base">
            {product.name}
          </span>
          <span className="block text-xs font-bold text-emerald-400 drop-shadow-md sm:text-sm">
            {formatCurrency(product.sale_price)}
          </span>
        </div>

        {/* Success flash overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-emerald-500/40 backdrop-blur-[2px] transition-all duration-100",
            animating ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <span className="scale-125 text-5xl font-black text-white drop-shadow-lg transition-transform">
            +1
          </span>
        </div>
      </button>

      {/* Badge with count + undo */}
      {count > 0 && (
        <div className="absolute -right-2 -top-2 z-10 flex flex-col items-center gap-1">
          <span className="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-emerald-500 px-2 text-sm font-bold text-white shadow-lg ring-2 ring-background">
            {count}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUndo(product.id);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-lg ring-2 ring-background transition-all hover:bg-red-600 active:scale-90"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
