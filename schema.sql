-- SQL DDL for the orders table in Supabase (Postgres)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    customer_id UUID NOT NULL, -- References auth.users(id)
    address TEXT NOT NULL,
    lat NUMERIC(10, 7),
    lon NUMERIC(10, 7),
    vegetables JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'))
);
