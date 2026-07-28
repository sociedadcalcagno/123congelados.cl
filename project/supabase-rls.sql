-- ============================================================
-- ROW LEVEL SECURITY (RLS) para 123Congelados
-- Ejecutar DESPUÉS del schema y seed data
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Política base:
-- - Tienda pública: puede leer productos/promociones.
-- - Mantenedores autenticados: pueden administrar productos, pedidos,
--   clientes, inventario, ventas y promociones.

-- Políticas: tienda publica puede leer, mantenedores autenticados pueden escribir.
-- Crear mantenedores en Supabase > Authentication > Users.
DROP POLICY IF EXISTS "products_select" ON products;
DROP POLICY IF EXISTS "products_insert" ON products;
DROP POLICY IF EXISTS "products_update" ON products;
DROP POLICY IF EXISTS "products_delete" ON products;
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "products_delete" ON products FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "orders_select" ON orders;
DROP POLICY IF EXISTS "orders_insert" ON orders;
DROP POLICY IF EXISTS "orders_update" ON orders;
DROP POLICY IF EXISTS "orders_delete" ON orders;
CREATE POLICY "orders_select" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "orders_delete" ON orders FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "order_items_select" ON order_items;
DROP POLICY IF EXISTS "order_items_insert" ON order_items;
DROP POLICY IF EXISTS "order_items_update" ON order_items;
DROP POLICY IF EXISTS "order_items_delete" ON order_items;
CREATE POLICY "order_items_select" ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_update" ON order_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "order_items_delete" ON order_items FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "customers_select" ON customers;
DROP POLICY IF EXISTS "customers_insert" ON customers;
DROP POLICY IF EXISTS "customers_update" ON customers;
DROP POLICY IF EXISTS "customers_delete" ON customers;
CREATE POLICY "customers_select" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "customers_insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "customers_update" ON customers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "customers_delete" ON customers FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "inventory_movements_select" ON inventory_movements;
DROP POLICY IF EXISTS "inventory_movements_insert" ON inventory_movements;
DROP POLICY IF EXISTS "inventory_movements_update" ON inventory_movements;
DROP POLICY IF EXISTS "inventory_movements_delete" ON inventory_movements;
CREATE POLICY "inventory_movements_select" ON inventory_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "inventory_movements_insert" ON inventory_movements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "inventory_movements_update" ON inventory_movements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "inventory_movements_delete" ON inventory_movements FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "sales_data_select" ON sales_data;
DROP POLICY IF EXISTS "category_sales_select" ON category_sales;
CREATE POLICY "sales_data_select" ON sales_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "category_sales_select" ON category_sales FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "promotions_select" ON promotions;
DROP POLICY IF EXISTS "promotions_insert" ON promotions;
DROP POLICY IF EXISTS "promotions_update" ON promotions;
DROP POLICY IF EXISTS "promotions_delete" ON promotions;
CREATE POLICY "promotions_select" ON promotions FOR SELECT USING (true);
CREATE POLICY "promotions_insert" ON promotions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "promotions_update" ON promotions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "promotions_delete" ON promotions FOR DELETE TO authenticated USING (true);
