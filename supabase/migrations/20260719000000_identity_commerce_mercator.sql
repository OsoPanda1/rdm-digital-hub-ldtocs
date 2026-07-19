begin;

alter table public.businesses add column if not exists cattleya_tier text not null default 'BASE';
alter table public.businesses add column if not exists did_bookpi text;
alter table public.businesses add column if not exists public_visible boolean not null default true;
alter table public.businesses add column if not exists updated_at timestamptz not null default now();

update public.businesses set cattleya_tier = 'BASE'
where cattleya_tier not in ('BASE', 'CUIDADO', 'GUARDIAN', 'EMBAJADOR');

do $$ begin
  alter table public.businesses add constraint businesses_cattleya_tier_check
    check (cattleya_tier in ('BASE', 'CUIDADO', 'GUARDIAN', 'EMBAJADOR'));
exception when duplicate_object then null; end $$;

create unique index if not exists businesses_did_bookpi_unique
  on public.businesses (did_bookpi) where did_bookpi is not null;
create index if not exists businesses_owner_idx on public.businesses(owner_id);

create table if not exists public.commerce_intents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency in ('mxn', 'usd')),
  status text not null default 'created' check (status in ('created','processing','succeeded','failed','cancelled')),
  stripe_payment_intent_id text unique,
  correlation_id uuid not null default gen_random_uuid(),
  idempotency_key text not null unique,
  failure_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.businesses enable row level security;
alter table public.commerce_intents enable row level security;

drop policy if exists "Public can view businesses" on public.businesses;
drop policy if exists "businesses_public_read" on public.businesses;
create policy "businesses_public_read" on public.businesses for select
  using (is_active = true and public_visible = true);

drop policy if exists "businesses_owner_insert" on public.businesses;
create policy "businesses_owner_insert" on public.businesses for insert to authenticated
  with check (owner_id = auth.uid());
drop policy if exists "businesses_owner_update" on public.businesses;
create policy "businesses_owner_update" on public.businesses for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "businesses_owner_delete" on public.businesses;
create policy "businesses_owner_delete" on public.businesses for delete to authenticated
  using (owner_id = auth.uid());

create policy "commerce_intents_owner_read" on public.commerce_intents for select to authenticated
  using (owner_id = auth.uid());
create policy "commerce_intents_owner_insert" on public.commerce_intents for insert to authenticated
  with check (owner_id = auth.uid());

commit;
