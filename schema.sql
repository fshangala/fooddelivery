-- SQL DDL for the PremiumFresh project in Supabase (Postgres)

-- Ensure the UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders Table
-- Stores all vegetable delivery orders.
-- Linked to customers (creators) and drivers (assignees).
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Customer who placed the order
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Driver assigned to deliver the order (nullable until accepted/assigned)
    driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Delivery details
    address TEXT NOT NULL,
    lat NUMERIC(10, 7), -- Latitude for navigation
    lon NUMERIC(10, 7), -- Longitude for navigation
    delivery_instructions TEXT,
    
    -- Order content
    vegetables JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Order Status Workflow:
    -- PENDING: Order placed by customer, waiting for driver assignment/pickup.
    -- IN_PROGRESS: Driver has accepted/picked up the order.
    -- DELIVERED: Order successfully delivered.
    -- CANCELLED: Order cancelled by admin or customer.
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'))
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_driver_id ON orders(driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Row Level Security (RLS) Policies (Conceptual - to be applied in Supabase Dashboard or Migration)
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can see their own orders.
-- CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);

-- Policy: Customers can create orders.
-- CREATE POLICY "Customers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Policy: Drivers can view available (PENDING) orders or orders assigned to them.
-- CREATE POLICY "Drivers view assigned or pending" ON orders FOR SELECT USING (
--   (auth.jwt() ->> 'role' = 'driver') AND (status = 'PENDING' OR driver_id = auth.uid())
-- );

-- Policy: Admins can view/edit all orders.
-- (Usually handled by service role or specific admin policy)
