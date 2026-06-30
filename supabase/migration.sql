-- Run this in Supabase SQL Editor after creating your project

create table if not exists submissions (
  id          uuid        primary key default gen_random_uuid(),
  tab         text        not null check (tab in ('explore', 'love')),
  pathway     text        not null,
  name        text,
  email       text,
  social      text,
  phone       text,
  state       text,
  city        text,
  data        jsonb       default '{}',
  is_creator  boolean     default false,
  creator_data jsonb,
  is_brand    boolean     default false,
  brand_data  jsonb,
  created_at  timestamptz default now()
);

-- RLS: anyone can submit, only service role can read
alter table submissions enable row level security;

create policy "anon_insert" on submissions
  for insert to anon
  with check (true);

-- Index for admin queries
create index submissions_tab_idx on submissions (tab);
create index submissions_created_idx on submissions (created_at desc);
create index submissions_state_idx on submissions (state);
