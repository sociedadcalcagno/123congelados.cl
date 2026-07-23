import type { Product, Order, Customer, InventoryMovement } from "./data";

const SUPABASE_URL = "https://gacgollaafyecyszczbs.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!SUPABASE_KEY) {
    throw new Error("Falta VITE_SUPABASE_ANON_KEY en Netlify");
  }

  const url = `${SUPABASE_URL}${path}`;
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        apikey: SUPABASE_KEY,
        authorization: `Bearer ${SUPABASE_KEY}`,
        "content-type": "application/json",
        prefer: "return=representation",
        ...(init?.headers ?? {}),
      },
    });
  } catch (error) {
    throw new Error(JSON.stringify({
      message: "Fetch hacia Supabase falló antes de recibir respuesta",
      url,
      hasKey: Boolean(SUPABASE_KEY),
      keyPrefix: SUPABASE_KEY ? SUPABASE_KEY.slice(0, 12) : null,
      cause: error instanceof Error ? error.message : String(error),
    }));
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(payload ? JSON.stringify(payload) : text || `HTTP ${response.status}`);
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
