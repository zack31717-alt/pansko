-- Prevent duplicate supplier names in Supabase/Postgres.
-- Run this in the Supabase SQL Editor.
--
-- It matches the ERP frontend rule:
--   trim leading/trailing spaces, collapse repeated spaces, compare case-insensitively.

begin;

-- 1) Normalize existing supplier names for cleaner display and future inserts.
update public.suppliers
set name = regexp_replace(btrim(name), '\s+', ' ', 'g')
where name is not null
  and name <> regexp_replace(btrim(name), '\s+', ' ', 'g');

-- 2) Point products at one canonical supplier when duplicate suppliers already exist.
with supplier_keys as (
  select
    id,
    lower(regexp_replace(btrim(name), '\s+', ' ', 'g')) as supplier_key,
    row_number() over (
      partition by lower(regexp_replace(btrim(name), '\s+', ' ', 'g'))
      order by id
    ) as supplier_rank
  from public.suppliers
  where name is not null
    and btrim(name) <> ''
),
canonical_suppliers as (
  select
    supplier_key,
    id as canonical_id
  from supplier_keys
  where supplier_rank = 1
),
duplicate_suppliers as (
  select
    supplier_keys.id as duplicate_id,
    canonical_suppliers.canonical_id
  from supplier_keys
  join canonical_suppliers using (supplier_key)
  where supplier_keys.supplier_rank > 1
)
update public.products
set supplier_id = duplicate_suppliers.canonical_id
from duplicate_suppliers
where public.products.supplier_id = duplicate_suppliers.duplicate_id;

-- 3) Remove duplicate supplier rows after products have been repointed.
with supplier_keys as (
  select
    id,
    lower(regexp_replace(btrim(name), '\s+', ' ', 'g')) as supplier_key,
    row_number() over (
      partition by lower(regexp_replace(btrim(name), '\s+', ' ', 'g'))
      order by id
    ) as supplier_rank
  from public.suppliers
  where name is not null
    and btrim(name) <> ''
),
canonical_suppliers as (
  select
    supplier_key,
    id as canonical_id
  from supplier_keys
  where supplier_rank = 1
),
duplicate_suppliers as (
  select supplier_keys.id as duplicate_id
  from supplier_keys
  join canonical_suppliers using (supplier_key)
  where supplier_keys.supplier_rank > 1
)
delete from public.suppliers
using duplicate_suppliers
where public.suppliers.id = duplicate_suppliers.duplicate_id;

-- 4) Add the database-level guard.
create unique index if not exists suppliers_name_normalized_unique
on public.suppliers (
  lower(regexp_replace(btrim(name), '\s+', ' ', 'g'))
)
where name is not null
  and btrim(name) <> '';

commit;
