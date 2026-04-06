"use client";

import { useState } from "react";
import { useProducts, useUploadImage } from "@/hooks/use-products";
import { ProductList } from "@/components/products/product-list";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types/database";

export default function UrunlerPage() {
  const {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const { upload } = useUploadImage();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSubmit = async (data: {
    name: string;
    category: string;
    cost_price: number;
    sale_price: number;
    image_url: string | null;
  }) => {
    if (editingProduct) {
      const result = await updateProduct(editingProduct.id, data);
      if (result.success) {
        toast.success("Ürün güncellendi");
      } else {
        toast.error("Güncelleme başarısız");
      }
    } else {
      const result = await addProduct(data);
      if (result.success) {
        toast.success("Ürün eklendi");
      } else {
        toast.error("Ekleme başarısız");
      }
    }
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteProduct(id);
    if (result.success) {
      toast.success("Ürün silindi");
    } else {
      toast.error("Silme başarısız");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingProduct(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Package className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Ürün Yönetimi</h1>
            <p className="text-xs text-muted-foreground">
              {products.length} ürün
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
          size="lg"
        >
          <Plus className="mr-1 h-5 w-5" />
          Yeni Ürün
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : (
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Form Dialog */}
      <ProductForm
        open={formOpen}
        onOpenChange={handleOpenChange}
        product={editingProduct}
        onSubmit={handleSubmit}
        onUploadImage={upload}
      />
    </div>
  );
}
