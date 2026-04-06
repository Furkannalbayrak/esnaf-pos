export interface Product {
  id: string;
  name: string;
  category: string;
  cost_price: number;
  sale_price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  cost_price: number;
  total_amount: number;
  profit: number;
  created_at: string;
}

export interface SaleWithProduct extends Sale {
  products: Pick<Product, "name" | "category" | "image_url">;
}

export interface ProductSalesReport {
  product_id: string;
  product_name: string;
  category: string;
  total_quantity: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
}

export interface DailySalesData {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  count: number;
}

export type DateRange = "daily" | "weekly" | "monthly";
