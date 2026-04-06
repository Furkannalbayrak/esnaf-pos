"use client";

import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ProductSalesReport } from "@/types/database";

interface ProductTableProps {
  data: ProductSalesReport[];
}

export function ProductTable({ data }: ProductTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        Satış verisi bulunamadı
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card">
      <div className="p-4 pb-2">
        <h3 className="text-sm font-semibold">Ürün Bazlı Satışlar</h3>
      </div>
      <div className="overflow-x-auto px-2 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-xs">Ürün</TableHead>
              <TableHead className="text-right text-xs">Adet</TableHead>
              <TableHead className="text-right text-xs">Ciro</TableHead>
              <TableHead className="text-right text-xs">Kâr</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.product_id} className="border-border/30">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {item.product_name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="mt-0.5 w-fit text-[10px]"
                    >
                      {item.category}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.total_quantity}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {formatCurrency(item.total_revenue)}
                </TableCell>
                <TableCell
                  className={`text-right text-sm font-semibold ${item.total_profit >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                    }`}
                >
                  {formatCurrency(item.total_profit)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
