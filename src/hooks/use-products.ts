"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/database";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("category")
      .order("name");

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (
    product: Omit<Product, "id" | "created_at" | "is_active">
  ) => {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (!error && data) {
      setProducts((prev) => [...prev, data as Product]);
      return { success: true, data };
    }
    return { success: false, error };
  };

  const updateProduct = async (
    id: string,
    updates: Partial<Omit<Product, "id" | "created_at">>
  ) => {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? (data as Product) : p))
      );
      return { success: true, data };
    }
    return { success: false, error };
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    }
    return { success: false, error };
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return {
    products,
    categories,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}

export function useUploadImage() {
  const upload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  return { upload };
}
