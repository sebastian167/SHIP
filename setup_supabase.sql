-- Create Global Leaderboard Table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    call_sign TEXT NOT NULL,
    home_base TEXT NOT NULL,
    score INTEGER NOT NULL,
    accuracy NUMERIC NOT NULL,
    longest_streak INTEGER NOT NULL
);

-- Create Base Leaderboard Table
CREATE TABLE IF NOT EXISTS public.station_leaderboard (
    id SERIAL PRIMARY KEY,
    home_base TEXT NOT NULL UNIQUE,
    total_score INTEGER NOT NULL DEFAULT 0
);

-- Create Tricky Ten Table
CREATE TABLE IF NOT EXISTS public.tricky_ten (
    id SERIAL PRIMARY KEY,
    ship_number TEXT NOT NULL UNIQUE,
    misses INTEGER NOT NULL DEFAULT 1
);

-- Disable Row Level Security (or allow public access) for ease of development for this app
ALTER TABLE public.leaderboard DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_leaderboard DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tricky_ten DISABLE ROW LEVEL SECURITY;

-- If you prefer keeping RLS enabled instead, you must add these policies:
-- create policy "Enable read access for all users" on "public"."leaderboard" as permissive for select to public using (true);
-- create policy "Enable insert for all users" on "public"."leaderboard" as permissive for insert to public with check (true);
-- create policy "Enable update for all users" on "public"."leaderboard" as permissive for update to public using (true);
