"use client";

import { Package, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/database";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Package className="mb-3 h-12 w-12 opacity-30" />
        <p className="text-lg font-medium">Henüz ürün eklenmedi</p>
        <p className="text-sm">Başlamak için bir ürün ekleyin</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-border"
        >
          {/* Image */}
          <div className="h-32 w-full bg-secondary/50">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground/20" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {product.category}
                </Badge>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Alış: </span>
                <span className="font-medium">
                  {formatCurrency(product.cost_price)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Satış: </span>
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(product.sale_price)}
                </span>
              </div>
            </div>

            {/* Profit indicator */}
            <div className="mt-2 text-xs">
              <span className="text-muted-foreground">Kâr: </span>
              <span
                className={
                  product.sale_price - product.cost_price >= 0
                    ? "font-semibold text-emerald-400"
                    : "font-semibold text-red-400"
                }
              >
                {formatCurrency(product.sale_price - product.cost_price)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="absolute right-2 top-2 flex gap-1">
            <button
              onClick={() => onEdit(product)}
              className="rounded-lg bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="rounded-lg bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
