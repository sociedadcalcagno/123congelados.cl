-- Ejecutar en Supabase SQL Editor si ya tienes la base poblada.
-- Agrega calibres/opciones vendibles por producto sin borrar datos existentes.

create table if not exists product_variants (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  name text not null,
  price numeric not null,
  stock integer not null default 0,
  unit text not null default 'kg',
  weight text not null,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table product_variants disable row level security;

insert into product_variants (id, product_id, name, price, stock, unit, weight, active)
select 'v1', 'p1', 'Porción 200g', 5990, 80, 'paq', '200g', true
where exists (select 1 from products where id = 'p1')
  and not exists (select 1 from product_variants where id = 'v1');

insert into product_variants (id, product_id, name, price, stock, unit, weight, active)
select 'v2', 'p1', 'Filete 1kg', 14500, 35, 'kg', '1 kg', true
where exists (select 1 from products where id = 'p1')
  and not exists (select 1 from product_variants where id = 'v2');

insert into product_variants (id, product_id, name, price, stock, unit, weight, active)
select 'v3', 'p1', 'Entero por kg', 9800, 20, 'kg', '1 kg', true
where exists (select 1 from products where id = 'p1')
  and not exists (select 1 from product_variants where id = 'v3');
