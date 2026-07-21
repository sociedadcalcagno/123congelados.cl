-- ============================================================
-- SCHEMA para 123Congelados - Ejecutar en SQL Editor de Supabase
-- ============================================================

-- 1. PRODUCTOS
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  price numeric not null,
  "originalPrice" numeric,
  stock integer not null default 0,
  "minStock" integer not null default 5,
  unit text not null default 'kg',
  weight text not null,
  image text not null,
  description text not null default '',
  featured boolean not null default false,
  badge text,
  origin text not null default '',
  "coldChain" boolean not null default true,
  created_at timestamptz default now()
);

-- 2. ORDENES
create table orders (
  id text primary key,
  customer text not null,
  email text not null,
  phone text not null,
  address text not null,
  total numeric not null,
  status text not null default 'pendiente',
  date text not null,
  "paymentMethod" text not null,
  created_at timestamptz default now()
);

-- 3. ITEMS DE ORDEN
create table order_items (
  id uuid default gen_random_uuid() primary key,
  "orderId" text references orders(id) on delete cascade,
  "productId" text not null,
  quantity integer not null,
  price numeric not null,
  name text not null
);

-- 4. CLIENTES
create table customers (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  "totalOrders" integer not null default 0,
  "totalSpent" numeric not null default 0,
  "lastOrder" text not null,
  status text not null default 'activo'
);

-- 5. MOVIMIENTOS DE INVENTARIO
create table inventory_movements (
  id text primary key,
  "productId" text not null,
  "productName" text not null,
  type text not null,
  quantity integer not null,
  date text not null,
  reason text not null,
  "user" text not null
);

-- 6. DATOS DE VENTAS (dashboard)
create table sales_data (
  id serial primary key,
  month text not null,
  ventas numeric not null,
  pedidos integer not null
);

-- 7. VENTAS POR CATEGORIA (dashboard)
create table category_sales (
  id serial primary key,
  name text not null,
  value integer not null,
  color text not null
);

-- 8. PROMOCIONES
create table promotions (
  id text primary key,
  name text not null,
  code text not null unique,
  discount integer not null,
  type text not null default 'percent',
  category text not null default 'all',
  active boolean not null default true,
  uses integer not null default 0,
  expiry text not null
);

-- ============================================================
-- SEED DATA
-- ============================================================

insert into products (id, name, category, price, "originalPrice", stock, "minStock", unit, weight, image, description, featured, badge, origin, "coldChain") values
  ('p1', 'Salmón Atlántico Premium', 'salmon', 18990, 22990, 45, 10, 'kg', '1 kg', '/product-salmon.webp', 'Salmón atlántico fresco de primera calidad.', true, 'Más Vendido', 'Patagonia, Chile', true),
  ('p2', 'Filetes de Salmón Ahumado', 'salmon', 24990, null, 28, 8, 'paq', '500g', '/product-salmon.webp', 'Filetes de salmón ahumado al frío.', true, 'Premium', 'Puerto Montt, Chile', true),
  ('p3', 'Camarones Ecuatorianos', 'camarones', 15990, 19990, 60, 15, 'kg', '1 kg', '/product-camarones.webp', 'Camarones jumbo enteros congelados IQF.', true, 'Oferta', 'Ecuador', true),
  ('p4', 'Camarones Pelados XL', 'camarones', 19990, null, 35, 10, 'kg', '1 kg', '/product-camarones.webp', 'Camarones pelados y desvenados XL.', false, null, 'Ecuador', true),
  ('p5', 'Reineta Fresca Entera', 'reineta', 9990, null, 20, 5, 'kg', '1 kg', '/product-reineta.webp', 'Reineta fresca del Pacífico chileno.', true, 'Fresco', 'Valparaíso, Chile', true),
  ('p6', 'Filetes de Reineta', 'reineta', 12990, null, 15, 5, 'kg', '1 kg', '/product-reineta.webp', 'Filetes limpios de reineta sin espinas.', false, null, 'Chile', true),
  ('p7', 'Mix de Mariscos Premium', 'mariscos', 22990, null, 25, 8, 'kg', '1 kg', '/product-mariscos.webp', 'Mix seleccionado de mariscos frescos.', true, 'Nuevo', 'Chile', true),
  ('p8', 'Cholgas al Natural', 'mariscos', 8990, null, 40, 10, 'kg', '1 kg', '/product-mariscos.webp', 'Cholgas chilenas limpias y cocidas.', false, null, 'Chiloé, Chile', true),
  ('p9', 'Pack Congelados Premium', 'congelados', 44990, 55990, 12, 5, 'pack', '3 kg', '/product-congelados.webp', 'Pack premium con 1kg salmón + 1kg camarones + 1kg mix mariscos.', true, 'Pack Ahorro', 'Chile', true),
  ('p10', 'Merluza Filetes Congelados', 'congelados', 7990, null, 55, 20, 'kg', '1 kg', '/product-congelados.webp', 'Filetes de merluza congelados IQF.', false, null, 'Chile', true),
  ('p11', 'Salmón Porciones 200g', 'salmon', 5990, null, 80, 20, 'paq', '200g', '/product-salmon.webp', 'Porciones individuales de salmón.', false, null, 'Chile', true),
  ('p12', 'Calamar Entero Limpio', 'mariscos', 11990, null, 3, 8, 'kg', '1 kg', '/product-mariscos.webp', 'Calamar del Pacífico limpio y sin tinta.', false, null, 'Perú/Chile', true);

insert into orders (id, customer, email, phone, address, total, status, date, "paymentMethod") values
  ('ORD-2025-001', 'María González', 'maria.gonzalez@gmail.com', '+56 9 8765 4321', 'Av. Providencia 1234, Santiago', 53970, 'entregado', '2025-05-14', 'Tarjeta'),
  ('ORD-2025-002', 'Carlos Rodríguez', 'carlos.rod@outlook.com', '+56 9 7654 3210', 'Las Condes 567, Santiago', 44990, 'en_despacho', '2025-05-14', 'Transferencia'),
  ('ORD-2025-003', 'Ana Martínez', 'ana.mtz@gmail.com', '+56 9 6543 2109', 'Ñuñoa 890, Santiago', 72970, 'confirmado', '2025-05-15', 'Tarjeta'),
  ('ORD-2025-004', 'Luis Pérez', 'lperez@hotmail.com', '+56 9 5432 1098', 'Vitacura 2345, Santiago', 69950, 'pendiente', '2025-05-15', 'WhatsApp'),
  ('ORD-2025-005', 'Patricia Silva', 'patricia.silva@gmail.com', '+56 9 4321 0987', 'Maipú 3456, Santiago', 59960, 'entregado', '2025-05-13', 'Transferencia');

insert into order_items ("orderId", "productId", quantity, price, name) values
  ('ORD-2025-001', 'p1', 2, 18990, 'Salmón Atlántico Premium'),
  ('ORD-2025-001', 'p3', 1, 15990, 'Camarones Ecuatorianos'),
  ('ORD-2025-002', 'p9', 1, 44990, 'Pack Congelados Premium'),
  ('ORD-2025-003', 'p2', 2, 24990, 'Filetes de Salmón Ahumado'),
  ('ORD-2025-003', 'p7', 1, 22990, 'Mix de Mariscos Premium'),
  ('ORD-2025-004', 'p5', 3, 9990, 'Reineta Fresca Entera'),
  ('ORD-2025-004', 'p4', 2, 19990, 'Camarones Pelados XL'),
  ('ORD-2025-005', 'p1', 1, 18990, 'Salmón Atlántico Premium'),
  ('ORD-2025-005', 'p3', 2, 15990, 'Camarones Ecuatorianos'),
  ('ORD-2025-005', 'p8', 1, 8990, 'Cholgas al Natural');

insert into customers (id, name, email, phone, address, "totalOrders", "totalSpent", "lastOrder", status) values
  ('c1', 'María González', 'maria.gonzalez@gmail.com', '+56 9 8765 4321', 'Av. Providencia 1234, Santiago', 8, 285600, '2025-05-14', 'activo'),
  ('c2', 'Carlos Rodríguez', 'carlos.rod@outlook.com', '+56 9 7654 3210', 'Las Condes 567, Santiago', 5, 198450, '2025-05-14', 'activo'),
  ('c3', 'Ana Martínez', 'ana.mtz@gmail.com', '+56 9 6543 2109', 'Ñuñoa 890, Santiago', 12, 421800, '2025-05-15', 'activo'),
  ('c4', 'Luis Pérez', 'lperez@hotmail.com', '+56 9 5432 1098', 'Vitacura 2345, Santiago', 3, 89900, '2025-05-15', 'activo'),
  ('c5', 'Patricia Silva', 'patricia.silva@gmail.com', '+56 9 4321 0987', 'Maipú 3456, Santiago', 6, 156700, '2025-05-13', 'activo');

insert into inventory_movements (id, "productId", "productName", type, quantity, date, reason, "user") values
  ('m1', 'p1', 'Salmón Atlántico Premium', 'entrada', 50, '2025-05-14', 'Reabastecimiento proveedor', 'Admin'),
  ('m2', 'p3', 'Camarones Ecuatorianos', 'salida', 15, '2025-05-14', 'Venta ORD-2025-001', 'Sistema'),
  ('m3', 'p9', 'Pack Congelados Premium', 'entrada', 20, '2025-05-13', 'Reabastecimiento proveedor', 'Admin'),
  ('m4', 'p12', 'Calamar Entero Limpio', 'ajuste', -5, '2025-05-12', 'Merma por vencimiento', 'Admin'),
  ('m5', 'p5', 'Reineta Fresca Entera', 'salida', 10, '2025-05-12', 'Venta ORD-2025-005', 'Sistema');

insert into sales_data (month, ventas, pedidos) values
  ('Nov', 1850000, 38),
  ('Dic', 2940000, 62),
  ('Ene', 2200000, 45),
  ('Feb', 1980000, 41),
  ('Mar', 2650000, 54),
  ('Abr', 3100000, 67),
  ('May', 3450000, 72);

insert into category_sales (name, value, color) values
  ('Salmón', 38, 'var(--chart-1)'),
  ('Camarones', 25, 'var(--chart-2)'),
  ('Mariscos', 18, 'var(--chart-3)'),
  ('Congelados', 12, 'var(--chart-4)'),
  ('Reineta', 7, 'var(--chart-5)');

insert into promotions (id, name, code, discount, type, category, active, uses, expiry) values
  ('promo1', 'Descuento Salmón Mayo', 'SALMON20', 20, 'percent', 'salmon', true, 34, '2025-05-31'),
  ('promo2', 'Pack Ahorro Verano', 'VERANO15', 15, 'percent', 'all', true, 21, '2025-06-30'),
  ('promo3', 'Primera Compra', 'BIENVENIDO', 10, 'percent', 'all', true, 58, '2025-12-31'),
  ('promo4', 'Camarones 2x1', 'CAMARONES2X1', 50, 'percent', 'camarones', false, 12, '2025-04-30');
