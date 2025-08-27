-- Base schema for initial scope. Run in Supabase SQL Editor.

-- Enable pgcrypto for gen_random_uuid if not already.
create extension if not exists pgcrypto; -- safe if already enabled

-- PROFILES (extends auth.users)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  avatar_url text,
  role text check (role in ('attendee','organizer','admin')) default 'attendee',
  created_at timestamptz default now()
);

-- ORDERS (covers ticketmaster + future custom events)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  event_source text not null check (event_source in ('ticketmaster','custom')),
  event_id text not null,
  quantity integer not null check (quantity > 0),
  status text not null check (status in ('pending','paid','cancelled')) default 'pending',
  stripe_session_id text,
  total_amount integer,          -- cents
  currency text default 'AUD',
  attendee_name text,
  attendee_email text,
  attendee_phone text,
  attendee_dob date,
  attendee_gender text,
  attendee_id_number text,
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_event_id on public.orders(event_id);
create index if not exists idx_orders_stripe_session on public.orders(stripe_session_id);

-- Enable Row Level Security AFTER tables exist
alter table public.orders enable row level security;
alter table public.profiles enable row level security;

-- Re-create policies idempotently (no IF NOT EXISTS support for policies)
drop policy if exists "Public profiles read" on public.profiles;
create policy "Public profiles read" on public.profiles
  for select using ( true );

drop policy if exists "User manages own profile" on public.profiles;
create policy "User manages own profile" on public.profiles
  for all using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

drop policy if exists "User reads own orders" on public.orders;
create policy "User reads own orders" on public.orders
  for select using ( auth.uid() = user_id );

drop policy if exists "User inserts own orders" on public.orders;
create policy "User inserts own orders" on public.orders
  for insert with check ( auth.uid() = user_id );

-- Optional guest checkout (allow inserting orders with NULL user_id)
-- Uncomment if you want to allow anonymous orders without auth:
-- drop policy if exists "Guest inserts orders" on public.orders;
-- create policy "Guest inserts orders" on public.orders
--   for insert with check ( auth.uid() is null and user_id is null );

-- Organizer / analytics policies will be added when custom events are introduced.

-- (Remove duplicates above; extended schema for events/favorites will be applied separately when needed.)
