"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link as LinkIcon, ImageIcon } from "lucide-react";
import type { Product } from "@/types/database";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: {
    name: string;
    category: string;
    cost_price: number;
    sale_price: number;
    image_url: string | null;
  }) => Promise<void>;
  onUploadImage: (file: File) => Promise<string | null>;
}

export function ProductForm({
  open,
  onOpenChange,
  product,
  onSubmit,
  onUploadImage,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || "");
  const [costPrice, setCostPrice] = useState(
    product?.cost_price?.toString() || ""
  );
  const [salePrice, setSalePrice] = useState(
    product?.sale_price?.toString() || ""
  );
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(product?.image_url || "");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(product?.name || "");
      setCategory(product?.category || "");
      setCostPrice(product?.cost_price?.toString() || "");
      setSalePrice(product?.sale_price?.toString() || "");
      setImageUrl(product?.image_url || "");
      setPreviewUrl(product?.image_url || "");
    }
  }, [open, product]);

  const resetForm = () => {
    if (!product) {
      setName("");
      setCategory("");
      setCostPrice("");
      setSalePrice("");
      setImageUrl("");
      setPreviewUrl("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    const url = await onUploadImage(file);
    if (url) {
      setImageUrl(url);
      setPreviewUrl(url);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !costPrice || !salePrice) return;

    setSubmitting(true);
    await onSubmit({
      name,
      category,
      cost_price: parseFloat(costPrice),
      sale_price: parseFloat(salePrice),
      image_url: imageUrl || null,
    });
    resetForm();
    onOpenChange(false);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {product ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="product-name">Ürün Adı</Label>
            <Input
              id="product-name"
              placeholder="ör. Hamburger"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="product-category">Kategori</Label>
            <Input
              id="product-category"
              placeholder="ör. Yiyecek"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cost-price">Alış Fiyatı (DKK)</Label>
              <Input
                id="cost-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale-price">Satış Fiyatı (DKK)</Label>
              <Input
                id="sale-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Ürün Görseli</Label>

            {/* Toggle */}
            <div className="flex rounded-lg bg-secondary p-1">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  imageMode === "url"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode("file")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  imageMode === "file"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                Dosya Yükle
              </button>
            </div>

            {imageMode === "url" ? (
              <Input
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
              />
            ) : (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Yükleniyor...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Görsel Seç
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Preview */}
            {previewUrl && (
              <div className="mt-2 overflow-hidden rounded-xl border border-border">
                <img
                  src={previewUrl}
                  alt="Önizleme"
                  className="h-32 w-full object-cover"
                />
              </div>
            )}
            {!previewUrl && (
              <div className="mt-2 flex h-32 items-center justify-center rounded-xl border border-dashed border-border">
                <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting || uploading}
            className="mt-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {submitting ? "Kaydediliyor..." : product ? "Güncelle" : "Ekle"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
