-- SQL Migration for PremiumFresh
-- Run this in your Supabase SQL Editor to update your database schema.

-- 1. Enable UUID Extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Admin Existence Check Function
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

-- 3. Create Packages Table
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

-- 4. Create Subscriptions Table
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

-- 5. Update Orders Table
-- Add subscription link and delivery date to existing orders table.
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS delivery_date DATE;

-- 6. Create New Indexes
-- Optimize queries for subscriptions and scheduled deliveries.
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_packages_is_active ON packages(is_active);

-- 7. Enable Row Level Security (RLS) - Recommended
-- Note: You will need to define specific policies in the Supabase Dashboard.
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Examples)
-- Customers can view active packages
CREATE POLICY "Anyone can view active packages" ON packages FOR SELECT USING (is_active = true);

-- Customers can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
