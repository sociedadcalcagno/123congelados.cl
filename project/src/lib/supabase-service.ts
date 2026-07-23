import type { Product, Order, Customer, InventoryMovement } from "./data";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/.netlify/functions/supabase-proxy?path=${encodeURIComponent(path)}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.hint || text || `HTTP ${response.status}`);
  }

  return payload as T;
}

// ---------- Products ----------
export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/rest/v1/products?select=*&order=name.asc");
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const data = await apiFetch<Product[]>("/rest/v1/products?select=*", {
    method: "POST",
    body: JSON.stringify({ id: `p${Date.now()}`, ...product }),
  });
  return data[0];
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const data = await apiFetch<Product[]>(`/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=*`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return data[0];
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ---------- Orders ----------
export async function getOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/rest/v1/orders?select=*&order=date.desc");
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  await apiFetch(`/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ---------- Customers ----------
export async function getCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>("/rest/v1/customers?select=*&order=name.asc");
}

// ---------- Inventory Movements ----------
export async function getInventoryMovements(): Promise<InventoryMovement[]> {
  return apiFetch<InventoryMovement[]>("/rest/v1/inventory_movements?select=*&order=date.desc");
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
  return apiFetch<Promotion[]>("/rest/v1/promotions?select=*&order=name.asc");
}

export async function createPromotion(promo: Omit<Promotion, "id" | "uses">): Promise<Promotion> {
  const data = await apiFetch<Promotion[]>("/rest/v1/promotions?select=*", {
    method: "POST",
    body: JSON.stringify({ id: `promo${Date.now()}`, ...promo, uses: 0 }),
  });
  return data[0];
}

export async function updatePromotion(id: string, updates: Partial<Promotion>): Promise<void> {
  await apiFetch(`/rest/v1/promotions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deletePromotion(id: string): Promise<void> {
  await apiFetch(`/rest/v1/promotions?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ---------- Inventory Restock ----------
export async function restockProduct(productId: string, quantity: number, productName: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const products = await apiFetch<{ stock: number }[]>(`/rest/v1/products?id=eq.${encodeURIComponent(productId)}&select=stock`);
  const product = products[0];
  if (!product) return;

  await apiFetch(`/rest/v1/products?id=eq.${encodeURIComponent(productId)}`, {
    method: "PATCH",
    body: JSON.stringify({ stock: product.stock + quantity }),
  });

  await apiFetch("/rest/v1/inventory_movements", {
    method: "POST",
    body: JSON.stringify({
      id: `m${Date.now()}`,
      productId,
      productName,
      type: "entrada",
      quantity,
      date: today,
      reason: "Reabastecimiento manual",
      user: "Admin",
    }),
  });
}

// ---------- Dashboard ----------
export async function getSalesData(): Promise<{ month: string; ventas: number; pedidos: number }[]> {
  return apiFetch<{ month: string; ventas: number; pedidos: number }[]>("/rest/v1/sales_data?select=*&order=id.asc");
}

export async function getCategorySales(): Promise<{ name: string; value: number; color: string }[]> {
  return apiFetch<{ name: string; value: number; color: string }[]>("/rest/v1/category_sales?select=*&order=id.asc");
}
