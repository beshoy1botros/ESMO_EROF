-- Create events table for centralized analytics
-- Safe defaults: id as text with server default uuid; RLS enabled; no anon SELECT

create extension if not exists pgcrypto; -- for gen_random_uuid()

create table if not exists public.events (
  id text primary key default gen_random_uuid()::text,
  timestamp bigint not null,
  action text not null,
  path text,
  sessionId text,
  deviceId text,
  userAgent text,
  deviceType text,
  deviceVendor text,
  stage text,
  level text,
  videoId text,
  videoTitle text,
  currentTime double precision,
  watchedSeconds double precision
);

-- Helpful indexes
create index if not exists idx_events_timestamp on public.events (timestamp desc);
create index if not exists idx_events_device on public.events (deviceId);
create index if not exists idx_events_session on public.events (sessionId);
create index if not exists idx_events_action on public.events (action);

-- Enable RLS
alter table public.events enable row level security;

-- Do NOT create a SELECT policy for anon (dashboard reads via Service Role only)
-- Do NOT create an INSERT policy for anon if you ingest only through your server
-- (Service Role bypasses RLS). If you want to allow client-side direct inserts, you can
-- uncomment the policy below at your own risk:
-- create policy events_insert_anon on public.events
-- for insert to anon using (true) with check (true);

