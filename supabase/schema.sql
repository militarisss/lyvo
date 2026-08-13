-- ============================================================
-- LYVO — Schéma PostgreSQL (Supabase)
-- Auth: Supabase Auth (téléphone OTP principal, Google/Apple).
-- RLS à activer sur toutes les tables avant mise en production.
-- ============================================================

-- ---------- Utilisateurs ----------
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  first_name text not null,
  last_name text,
  email text,
  phone text unique,
  avatar_url text,
  birth_date date,
  lang text not null default 'fr' check (lang in ('fr','en','ar')),
  interests text[] not null default '{}',
  role text not null default 'client' check (role in ('client','provider','admin')),
  created_at timestamptz not null default now()
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  label text not null check (label in ('Maison','Travail','Autre')),
  line text not null,
  city text not null,
  lat double precision,
  lng double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Catalogue ----------
create table categories (
  id text primary key,           -- slug: 'beaute', 'auto'…
  name text not null,
  icon text,
  tint text,
  sort int not null default 0,
  active boolean not null default true
);

create table sub_categories (
  id text primary key,
  category_id text not null references categories on delete cascade,
  name text not null,
  icon text,
  sort int not null default 0
);

-- ---------- Prestataires ----------
create table providers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles,             -- compte "partner mode"
  name text not null,
  tagline text,
  description text,
  category_id text not null references categories,
  sub_category_id text references sub_categories,
  cover_url text,
  verified boolean not null default false,       -- validé par l'admin
  premium boolean not null default false,
  mobile boolean not null default false,         -- se déplace chez le client
  address text,
  city text not null default 'Casablanca',
  status text not null default 'pending' check (status in ('pending','approved','suspended')),
  created_at timestamptz not null default now()
);

create table provider_locations (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers on delete cascade,
  lat double precision not null,
  lng double precision not null,
  is_primary boolean not null default true
);

create table provider_photos (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers on delete cascade,
  url text not null,             -- Supabase Storage
  sort int not null default 0
);

create table services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers on delete cascade,
  name text not null,
  description text,
  price_mad numeric(10,2) not null,
  duration_min int not null,
  at_home boolean not null default false,
  active boolean not null default true
);

create table service_options (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services on delete cascade,
  name text not null,
  extra_price_mad numeric(10,2) not null default 0
);

create table availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references providers on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  open_time time not null,
  close_time time not null
);

-- ---------- Réservations ----------
create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles,
  provider_id uuid not null references providers,
  service_id uuid not null references services,
  option_id uuid references service_options,
  address_id uuid references addresses,          -- null => chez le prestataire
  date date not null,
  time time not null,
  instructions text,
  promo_code text,
  price_mad numeric(10,2) not null,
  fees_mad numeric(10,2) not null default 0,
  discount_mad numeric(10,2) not null default 0,
  total_mad numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','enroute','inprogress','done','cancelled','disputed')),
  created_at timestamptz not null default now()
);

create table booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings on delete cascade,
  status text not null,
  at timestamptz not null default now(),
  by_user uuid references profiles
);

-- ---------- Paiements & wallet ----------
create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings,
  gateway text not null check (gateway in ('cmi','stripe','payzone','cash','wallet')),
  amount_mad numeric(10,2) not null,
  commission_mad numeric(10,2) not null default 0,  -- part LYVO
  external_ref text,                                 -- id transaction passerelle
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  created_at timestamptz not null default now()
);

create table wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles,
  kind text not null check (kind in ('cashback','topup','payment','promo','referral','refund')),
  amount_mad numeric(10,2) not null,               -- signé: + crédit / - débit
  label text not null,
  booking_id uuid references bookings,
  created_at timestamptz not null default now()
);

create table promo_codes (
  code text primary key,
  label text not null,
  kind text not null check (kind in ('percent','fixed')),
  value numeric(10,2) not null,
  max_uses int,
  expires_at timestamptz,
  active boolean not null default true
);

-- ---------- Social ----------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings,
  user_id uuid not null references profiles,
  provider_id uuid not null references providers,
  rating int not null check (rating between 1 and 5),
  quality int check (quality between 1 and 5),
  punctuality int check (punctuality between 1 and 5),
  professionalism int check (professionalism between 1 and 5),
  value_for_money int check (value_for_money between 1 and 5),
  comment text,
  photo_url text,
  created_at timestamptz not null default now()
);

create table favorites (
  user_id uuid not null references profiles on delete cascade,
  provider_id uuid not null references providers on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, provider_id)
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles,
  provider_id uuid not null references providers,
  created_at timestamptz not null default now(),
  unique (user_id, provider_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations on delete cascade,
  sender_id uuid not null references profiles,
  text text,
  image_url text,
  booking_id uuid references bookings,
  lat double precision,
  lng double precision,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  kind text not null,
  title text not null,
  body text,
  booking_id uuid references bookings,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- Admin ----------
create table banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  provider_id uuid references providers,
  image_url text,
  active boolean not null default true,
  sort int not null default 0
);

create table disputes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings,
  opened_by uuid not null references profiles,
  message text not null,
  status text not null default 'open' check (status in ('open','investigating','resolved','refunded')),
  created_at timestamptz not null default now()
);

-- Index utiles
create index on providers (category_id, status);
create index on services (provider_id, active);
create index on bookings (user_id, status);
create index on bookings (provider_id, date);
create index on messages (conversation_id, created_at);
create index on notifications (user_id, read_at);
