import { supabase } from "./supabase";
import type { Product, Order, Customer, InventoryMovement } from "./data";

// ---------- Products ----------
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({ id: `p${Date.now()}`, ...product })
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Orders ----------
export async function getOrders(): Promise<Order[]> {
  const { data } = await supabase.from("orders").select("*").order("date", { ascending: false });
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
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
  const { data, error } = await supabase
    .from("promotions")
    .insert({ id: `promo${Date.now()}`, ...promo, uses: 0 })
    .select()
    .single();
  if (error) throw error;
  return data as Promotion;
}

export async function updatePromotion(id: string, updates: Partial<Promotion>): Promise<void> {
  const { error } = await supabase.from("promotions").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deletePromotion(id: string): Promise<void> {
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Inventory Restock ----------
export async function restockProduct(productId: string, quantity: number, productName: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);

  const { data: product, error: productError } = await supabase.from("products").select("stock").eq("id", productId).single();
  if (productError) throw productError;
  if (!product) return;

  const { error: updateError } = await supabase.from("products").update({ stock: product.stock + quantity }).eq("id", productId);
  if (updateError) throw updateError;
  const { error: movementError } = await supabase.from("inventory_movements").insert({
    id: `m${Date.now()}`,
    productId,
    productName,
    type: "entrada",
    quantity,
    date: today,
    reason: "Reabastecimiento manual",
    user: "Admin",
  });
  if (movementError) throw movementError;
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
