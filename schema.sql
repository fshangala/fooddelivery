-- SQL DDL for the PremiumFresh project in Supabase (Postgres)

-- Ensure the UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
-- Stores additional user information like role, name, and phone.
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT now(),
    name TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'driver', 'admin')),
    email TEXT,
    phone TEXT
);

-- Enable Row Level Security (RLS) on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Users can read their own profile.
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile.
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Public access to check if an admin exists (used during bootstrap)
CREATE POLICY "Public can view admin existence" ON profiles
    FOR SELECT USING (role = 'admin');

-- Admin Existence Check Function
-- Allows checking if an admin exists in profiles from the public schema.
CREATE OR REPLACE FUNCTION public.check_admin_exists()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a profile after a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.raw_user_meta_data->>'role', 
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

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
