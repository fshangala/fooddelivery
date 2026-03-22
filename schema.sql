-- SQL DDL for the PremiumFresh project in Supabase (Postgres)

-- Ensure the UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Existence Check Function
-- Allows checking if an admin exists in auth.users from the public schema.
-- This is used for the bootstrap process without needing a separate profiles table.
CREATE OR REPLACE FUNCTION public.check_admin_exists()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Packages Table
-- Stores available subscription packages created by admins.
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    image_url TEXT,
    price NUMERIC(10, 2),
    vegetables JSONB NOT NULL DEFAULT '[]'::jsonb, -- List of vegetables included
    is_active BOOLEAN DEFAULT true
);

-- Subscriptions Table
-- Tracks active subscriptions for customers.
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES packages(id),
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED'))
);

-- Orders Table
-- Stores all vegetable delivery orders.
-- Linked to customers (creators) and drivers (assignees).
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Customer who placed the order
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Subscription Link (Optional, for recurring orders)
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    -- Driver assigned to deliver the order (nullable until accepted/assigned)
    driver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Delivery details
    address TEXT NOT NULL,
    lat NUMERIC(10, 7), -- Latitude for navigation
    lon NUMERIC(10, 7), -- Longitude for navigation
    delivery_instructions TEXT,
    delivery_date DATE, -- Targeted delivery date
    
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
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_packages_is_active ON packages(is_active);
