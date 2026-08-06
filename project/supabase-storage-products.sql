-- Ejecutar en Supabase SQL Editor para habilitar imágenes de productos.
-- Crea bucket publico "products" y políticas para subir/leer imágenes.

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

drop policy if exists "products_images_select" on storage.objects;
drop policy if exists "products_images_insert" on storage.objects;
drop policy if exists "products_images_update" on storage.objects;
drop policy if exists "products_images_delete" on storage.objects;

create policy "products_images_select"
on storage.objects for select
using (bucket_id = 'products');

create policy "products_images_insert"
on storage.objects for insert
with check (bucket_id = 'products');

create policy "products_images_update"
on storage.objects for update
using (bucket_id = 'products')
with check (bucket_id = 'products');

create policy "products_images_delete"
on storage.objects for delete
using (bucket_id = 'products');
