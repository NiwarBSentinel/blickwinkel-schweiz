create table if not exists newsletter (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamptz default now()
);

alter table newsletter enable row level security;

-- Allow anonymous inserts (for newsletter signup)
create policy "Anyone can subscribe" on newsletter
  for insert with check (true);

-- Only authenticated service role can read
create policy "Service role can read" on newsletter
  for select using (auth.role() = 'service_role');
