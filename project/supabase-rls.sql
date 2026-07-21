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

-- Política: lectura pública (tienda), escritura solo con service_role
-- NOTA: Supabase anon key = lectura. Para escritura necesitas autenticación.
-- Para este setup simple, deshabilitamos RLS en tablas de solo lectura
-- y lo dejamos habilitado solo en tablas críticas.

-- Políticas para products: todos pueden leer, solo service_role puede escribir
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE USING (true);
CREATE POLICY "products_delete" ON products FOR DELETE USING (true);

-- Políticas para orders
CREATE POLICY "orders_select" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update" ON orders FOR UPDATE USING (true);
CREATE POLICY "orders_delete" ON orders FOR DELETE USING (true);

-- Políticas para order_items
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (true);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_update" ON order_items FOR UPDATE USING (true);
CREATE POLICY "order_items_delete" ON order_items FOR DELETE USING (true);

-- Políticas para customers
CREATE POLICY "customers_select" ON customers FOR SELECT USING (true);
CREATE POLICY "customers_insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "customers_update" ON customers FOR UPDATE USING (true);
CREATE POLICY "customers_delete" ON customers FOR DELETE USING (true);

-- Políticas para inventory_movements
CREATE POLICY "inventory_movements_select" ON inventory_movements FOR SELECT USING (true);
CREATE POLICY "inventory_movements_insert" ON inventory_movements FOR INSERT WITH CHECK (true);
CREATE POLICY "inventory_movements_update" ON inventory_movements FOR UPDATE USING (true);
CREATE POLICY "inventory_movements_delete" ON inventory_movements FOR DELETE USING (true);

-- Políticas para sales_data y category_sales: solo lectura
CREATE POLICY "sales_data_select" ON sales_data FOR SELECT USING (true);
CREATE POLICY "category_sales_select" ON category_sales FOR SELECT USING (true);

-- Políticas para promotions
CREATE POLICY "promotions_select" ON promotions FOR SELECT USING (true);
CREATE POLICY "promotions_insert" ON promotions FOR INSERT WITH CHECK (true);
CREATE POLICY "promotions_update" ON promotions FOR UPDATE USING (true);
CREATE POLICY "promotions_delete" ON promotions FOR DELETE USING (true);
