import { supabase } from "./supabase";
import type { Product, Order, Customer, InventoryMovement } from "./data";

// ---------- Products ----------
export async function getProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*").order("name");
  return (data ?? []) as Product[];
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const { data } = await supabase.from("products").insert(product).select().single();
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data } = await supabase.from("products").update(updates).eq("id", id).select().single();
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  await supabase.from("products").delete().eq("id", id);
}

// ---------- Orders ----------
export async function getOrders(): Promise<Order[]> {
  const { data } = await supabase.from("orders").select("*").order("date", { ascending: false });
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  await supabase.from("orders").update({ status }).eq("id", id);
}

// ---------- Customers ----------
export async function getCustomers(): Promise<Customer[]> {
  const { data } = await supabase.from("customers").select("*").order("name");
  return (data ?? []) as Customer[];
}

// ---------- Inventory Movements ----------
export async function getInventoryMovements(): Promise<InventoryMovement[]> {
  const { data } = await supabase.from("inventory_movements").select("*").order("date", { ascending: false });
  return (data ?? []) as InventoryMovement[];
}

// ---------- Promotions ----------
export interface Promotion {
  id: string;
  name: string;
  code: string;
  discount: number;
  type: "percent";
  category: string;
  active: boolean;
  uses: number;
  expiry: string;
}

export async function getPromotions(): Promise<Promotion[]> {
  const { data } = await supabase.from("promotions").select("*").order("name");
  return (data ?? []) as Promotion[];
}

export async function createPromotion(promo: Omit<Promotion, "id" | "uses">): Promise<Promotion> {
  const { data } = await supabase.from("promotions").insert({ ...promo, uses: 0 }).select().single();
  return data as Promotion;
}

export async function updatePromotion(id: string, updates: Partial<Promotion>): Promise<void> {
  await supabase.from("promotions").update(updates).eq("id", id);
}

export async function deletePromotion(id: string): Promise<void> {
  await supabase.from("promotions").delete().eq("id", id);
}

// ---------- Inventory Restock ----------
export async function restockProduct(productId: string, quantity: number, productName: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);

  const { data: product } = await supabase.from("products").select("stock").eq("id", productId).single();
  if (!product) return;

  await supabase.from("products").update({ stock: product.stock + quantity }).eq("id", productId);
  await supabase.from("inventory_movements").insert({
    id: `m${Date.now()}`,
    productId,
    productName,
    type: "entrada",
    quantity,
    date: today,
    reason: "Reabastecimiento manual",
    user: "Admin",
  });
}

// ---------- Dashboard ----------
export async function getSalesData(): Promise<{ month: string; ventas: number; pedidos: number }[]> {
  const { data } = await supabase.from("sales_data").select("*").order("id");
  return (data ?? []) as { month: string; ventas: number; pedidos: number }[];
}

export async function getCategorySales(): Promise<{ name: string; value: number; color: string }[]> {
  const { data } = await supabase.from("category_sales").select("*").order("id");
  return (data ?? []) as { name: string; value: number; color: string }[];
}
